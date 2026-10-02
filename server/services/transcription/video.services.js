import fs from "fs"
import path from "path"
import ApiError from "../../utils/apiError.js"
import { AIsummarizer } from "../ai/ai.services.js"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import Groq from "groq-sdk"

/**
 * Transcribe a local video/audio file using Groq Whisper,
 * then summarize the transcript with the AI summarizer.
 *
 * @param {string} filePath - Absolute or relative path to the uploaded video file
 * @returns {Promise<{summary, title, keyPoints, keywords, transcript: string}>}
 */
export const videoTranscriptService = async (filePath) => {
    if (!filePath || !fs.existsSync(filePath)) {
        throw new ApiError(400, "Video file not found or path is invalid")
    }

    // Configure Groq with a 10-minute timeout for large video file uploads and transcriptions
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
        timeout: 10 * 60 * 1000, // 10 minutes
    })

    let transcript
    try {
        console.log(`[Video Transcription] Sending ${filePath} to Groq Whisper...`)
        const fileStream = fs.createReadStream(filePath)

        // Groq Whisper – speech-to-text
        const transcription = await groq.audio.transcriptions.create({
            file: fileStream,
            model: "whisper-large-v3-turbo",
            response_format: "verbose_json",
            temperature: 0,
        })

        transcript = transcription?.text?.trim()
        console.log(`[Video Transcription] Completed. Transcript length: ${transcript?.length || 0} characters`)

        if (!transcript) {
            throw new ApiError(422, "Transcription returned empty. The video may have no audible speech.")
        }
    } catch (err) {
        if (err instanceof ApiError) throw err
        console.error("[Video Transcription] Groq error:", err.message || err)
        if (err?.name === "APIConnectionTimeoutError") {
            throw new ApiError(504, "Video transcription timed out while communicating with AI service. Try a shorter video or extract the audio.")
        }
        if (err?.status === 429) {
            throw new ApiError(429, "Transcription service rate limit reached. Please try again shortly.")
        }
        if (err?.status === 413) {
            throw new ApiError(413, "Video file is too large for transcription (max 25 MB).")
        }
        throw new ApiError(502, `Transcription failed: ${err.message || "Unknown error"}`)
    }

    // Split transcript into chunks and summarize
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 3000,
        chunkOverlap: 300,
    })
    const chunks = await splitter.splitText(transcript)

    console.log(`[Video Summarization] Generating summary from ${chunks.length} transcript chunk(s)...`)
    const summaryResult = await AIsummarizer(chunks)

    // Attach transcript to the result so the controller can persist it
    return {
        ...summaryResult,
        transcript,
    }
}
