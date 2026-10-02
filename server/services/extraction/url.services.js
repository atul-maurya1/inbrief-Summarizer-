import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import Firecrawl from "@mendable/firecrawl-js"
import { AIsummarizer } from "../ai/ai.services.js"
import ApiError from "../../utils/apiError.js"

/**
 * Scrape a URL, summarize it, and return both the summary and the raw markdown
 * so the caller can pass the markdown to the RAG chunker.
 *
 * @returns {{ summary, title, keyPoints, keywords, rawText: string }}
 */
export const urlService = async (url) => {
    try {
        const firecrawl = new Firecrawl({
            apiKey: process.env.FIRECRAWL_API_KEY,
        })

        const result = await firecrawl.scrape(url, {
            formats: ["markdown"],
        })

        if (!result?.markdown) {
            throw new ApiError(422, "Could not extract content from the provided URL. The page may be empty or require authentication.")
        }

        const rawText = result.markdown

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 3000,
            chunkOverlap: 300,
        })

        const chunks = await splitter.splitText(rawText)
        const summaryResult = await AIsummarizer(chunks)

        // Return summary fields + the raw extracted text for RAG chunking
        return { ...summaryResult, rawText }
    } catch (err) {
        if (err instanceof ApiError) throw err
        if (err?.statusCode === 402) throw new ApiError(402, "URL scraping quota exhausted. Please try again later.")
        if (err?.statusCode === 429) throw new ApiError(429, "URL scraping rate limit reached. Please try again shortly.")
        console.error("[URL Service] Error:", err.message)
        throw new ApiError(502, "Failed to fetch content from URL. Please check the URL and try again.")
    }
}