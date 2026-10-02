import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { AIsummarizer } from "../ai/ai.services.js"
import ApiError from "../../utils/apiError.js"

export const extractTextFromPdf = async (pdfUrl) => {
    try {
        const response = await fetch(pdfUrl)
        if (!response.ok) {
            throw new ApiError(502, `Failed to download PDF from storage (${response.status})`)
        }

        const buffer = await response.arrayBuffer()
        const blob = new Blob([buffer], { type: "application/pdf" })

        const loader = new PDFLoader(blob)
        const docs = await loader.load()

        if (!docs || docs.length === 0) {
            throw new ApiError(422, "No readable text found in the PDF. The file may be empty or password-protected.")
        }

        // Clean text with clean page headings
        const pageTexts = docs
            .map((doc, idx) => {
                const text = doc.pageContent?.trim() 
                if (!text) return null
                return `[Page ${idx + 1}]\n${text}`
            })
            .filter(Boolean)

        if (pageTexts.length === 0) {
            throw new ApiError(422, "PDF text extraction returned empty content.")
        }

        return await AIsummarizer(pageTexts)
    } catch (err) {
        if (err instanceof ApiError) throw err
        console.error("[PDF Extraction] Error:", err.message || err)
        throw new ApiError(500, `Failed to extract and summarize PDF: ${err.message || "Unknown error"}`)
    }
}