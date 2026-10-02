import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiRespone.js"
import textServices from "../services/extraction/text.services.js"
import { extractTextFromPdf } from "../services/extraction/pdf.services.js"
import { urlService } from "../services/extraction/url.services.js"
import { videoTranscriptService } from "../services/transcription/video.services.js"
import pdfUploader from "../config/cloudinary.config.js"
import Content from "../models/content.model.js"
import Summary from "../models/summary.model.js"
import mongoose from "mongoose"
import { pdfChunking, textChunking, urlChunking } from "../services/rag/chunk.services.js"
import { deleteFile } from "../utils/multer.js"

export const summarizeContent = async (req, res, next) => {
    const uploadedFilePath = req.file?.path ?? null

    try {
        const userId = req.user.id
        const { text, url } = req.body

        if (!text && !url && !req.file) {
            return next(new ApiError(400, "Please provide an input (text, URL, or file)"))
        }

        let summaryData, contentId

        // ─── TEXT ────────────────────────────────────────────────────────────────
        if (text) {
            summaryData = await textServices(text)
            if (!summaryData) throw new ApiError(500, "AI summarization returned no result")

            const summary = await Summary.create({ ...summaryData, contentType: "text" })

            const content = await Content.create({
                user: userId,
                text,
                contentType: "text",
                summary: summary._id,
                title: summary.title,
            })
            contentId = content._id

            // Fire-and-forget RAG chunking
            textChunking(text, userId, content._id).catch((err) => {
                console.error("[RAG] Text chunking failed:", err.message)
            })
        }

        // ─── URL ─────────────────────────────────────────────────────────────────
        else if (url) {
            const urlResult = await urlService(url)
            if (!urlResult) throw new ApiError(500, "AI summarization returned no result")

            // Separate rawText (for RAG) from the summary fields (for DB/client)
            const { rawText, ...summaryFields } = urlResult
            summaryData = summaryFields

            const summary = await Summary.create({ ...summaryFields, contentType: "url" })

            const content = await Content.create({
                user: userId,
                url,
                contentType: "url",
                summary: summary._id,
                title: summary.title,
            })
            contentId = content._id

            // Fire-and-forget: chunk the scraped text (not the raw URL)
            if (rawText) {
                urlChunking(rawText, userId, content._id).catch((err) => {
                    console.error("[RAG] URL chunking failed:", err.message)
                })
            }
        }

        // ─── FILE (PDF or Video) ──────────────────────────────────────────────────
        else if (req.file) {
            const { mimetype } = req.file

            // ── PDF ──────────────────────────────────────────────────────────────
            if (mimetype === "application/pdf") {
                const uploaded = await pdfUploader(req.file.path)
                summaryData = await extractTextFromPdf(uploaded.secure_url)
                if (!summaryData) throw new ApiError(500, "AI summarization returned no result")

                const summary = await Summary.create({ ...summaryData, contentType: "pdf" })

                const content = await Content.create({
                    user: userId,
                    originalFileName: req.file.originalname,
                    fileUrl: uploaded.secure_url,
                    contentType: "pdf",
                    summary: summary._id,
                    title: summary.title,
                })
                contentId = content._id

                // Fire-and-forget RAG chunking
                pdfChunking(uploaded.secure_url, userId, content._id).catch((err) => {
                    console.error("[RAG] PDF chunking failed:", err.message)
                })
            }

            // ── VIDEO ─────────────────────────────────────────────────────────────
            else if (mimetype.startsWith("video/")) {
                summaryData = await videoTranscriptService(req.file.path)
                if (!summaryData) throw new ApiError(500, "Video transcription returned no result")

                const { transcript, ...summaryFields } = summaryData
                const summary = await Summary.create({
                    ...summaryFields,
                    transcript,
                    contentType: "video",
                })

                const content = await Content.create({
                    user: userId,
                    originalFileName: req.file.originalname,
                    fileUrl: null,
                    contentType: "video",
                    summary: summary._id,
                    title: summary.title,
                })
                contentId = content._id

                // Fire-and-forget RAG chunking on the transcript
                if (transcript) {
                    textChunking(transcript, userId, content._id).catch((err) => {
                        console.error("[RAG] Video transcript chunking failed:", err.message)
                    })
                }
            } else {
                return next(new ApiError(400, "Unsupported file type. Please upload a PDF or video file."))
            }
        }

        // Always cleanup the temp file
        deleteFile(uploadedFilePath)

        return res.status(200).json(
            new ApiResponse(200, { response: summaryData, contentId }, "Summary generated successfully")
        )
    } catch (err) {
        // Clean up temp file on error
        deleteFile(uploadedFilePath)
        console.error("[Summarizer] Error:", err.message)
        return next(err instanceof ApiError ? err : new ApiError(500, "Internal server error"))
    }
}

export const history = async (req, res, next) => {
    try {
        const userId = req.user.id
        const historyItems = await Content.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    summary: 1,
                    contentType: 1,
                    createdAt: 1,
                },
            },
            { $sort: { createdAt: -1 } },
        ])

        return res.status(200).json(
            new ApiResponse(200, historyItems, "History fetched successfully")
        )
    } catch (err) {
        console.error("[History] Error:", err.message)
        return next(err instanceof ApiError ? err : new ApiError(500, "Internal server error"))
    }
}

export const historyContent = async (req, res, next) => {
    try {
        const { summaryId, contentId } = req.query

        if (!summaryId || !contentId) {
            return next(new ApiError(400, "summaryId and contentId query parameters are required"))
        }

        if (!mongoose.Types.ObjectId.isValid(summaryId) || !mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ApiError(400, "Invalid summaryId or contentId"))
        }

        const [summary, content] = await Promise.all([
            Summary.findById(summaryId),
            Content.findById(contentId),
        ])

        if (!summary || !content) {
            return next(new ApiError(404, "History content not found"))
        }

        // Authorization check
        if (content.user.toString() !== req.user.id.toString()) {
            return next(new ApiError(403, "You are not authorized to access this content"))
        }

        return res.status(200).json(
            new ApiResponse(200, { summary, content }, "History fetched successfully")
        )
    } catch (err) {
        console.error("[HistoryContent] Error:", err.message)
        return next(err instanceof ApiError ? err : new ApiError(500, "Internal server error"))
    }
}