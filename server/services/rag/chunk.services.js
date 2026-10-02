import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { Document } from "@langchain/core/documents"
import { embeddingGenerator } from "./embedding.services.js"

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 })

/**
 * Chunk a PDF (by URL, e.g. a Cloudinary link) and store in Qdrant.
 * Only call this for actual PDF files – not for web page URLs.
 */
export const pdfChunking = async (pdfUrl, userId, contentId) => {
    try {
        const response = await fetch(pdfUrl)

        if (!response.ok) {
            console.error(`[RAG] Failed to fetch PDF from ${pdfUrl}: ${response.status}`)
            return
        }

        const contentType = response.headers.get("content-type") || ""
        if (!contentType.includes("pdf")) {
            console.warn(`[RAG] URL does not appear to be a PDF (content-type: ${contentType}). Skipping pdfChunking.`)
            return
        }

        const buffer = await response.arrayBuffer()
        const blob = new Blob([buffer], { type: "application/pdf" })

        const loader = new PDFLoader(blob)
        const docs = await loader.load()

        if (!docs || docs.length === 0) {
            console.warn("[RAG] PDF loader returned no documents – skipping embedding.")
            return
        }

        const chunks = await splitter.splitDocuments(docs)

        chunks.forEach((chunk, index) => {
            chunk.metadata = {
                ...chunk.metadata,
                userId: userId.toString(),
                contentId: contentId.toString(),
                contentType: "pdf",
                chunkIndex: index,
            }
        })

        await embeddingGenerator(chunks)
    } catch (err) {
        // Fire-and-forget – log but don't crash the parent request
        console.error("[RAG] pdfChunking error:", err.message)
        throw err
    }
}

/**
 * Chunk a plain text string and store in Qdrant.
 * Used for text input and video transcripts.
 */
export const textChunking = async (text, userId, contentId) => {
    try {
        if (!text || typeof text !== "string" || text.trim().length === 0) {
            console.warn("[RAG] textChunking received empty text – skipping.")
            return
        }

        const document = new Document({
            pageContent: text,
            metadata: {
                userId: userId.toString(),
                contentId: contentId.toString(),
                contentType: "text",
            },
        })

        const chunks = await splitter.splitDocuments([document])

        chunks.forEach((chunk, index) => {
            chunk.metadata.chunkIndex = index
        })

        await embeddingGenerator(chunks)
    } catch (err) {
        console.error("[RAG] textChunking error:", err.message)
        throw err
    }
}

/**
 * Chunk a URL by scraping its text content (use after firecrawl extracts markdown).
 * Pass the already-extracted text, not the raw URL.
 */
export const urlChunking = async (markdownText, userId, contentId) => {
    try {
        if (!markdownText || markdownText.trim().length === 0) {
            console.warn("[RAG] urlChunking received empty content – skipping.")
            return
        }

        const document = new Document({
            pageContent: markdownText,
            metadata: {
                userId: userId.toString(),
                contentId: contentId.toString(),
                contentType: "url",
            },
        })

        const chunks = await splitter.splitDocuments([document])

        chunks.forEach((chunk, index) => {
            chunk.metadata.chunkIndex = index
        })

        await embeddingGenerator(chunks)
    } catch (err) {
        console.error("[RAG] urlChunking error:", err.message)
        throw err
    }
}