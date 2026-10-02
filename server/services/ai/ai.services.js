import Groq from "groq-sdk"
import { ChatOpenRouter } from "@langchain/openrouter"
import ApiError from "../../utils/apiError.js"
import { z } from "zod"

const summarySchema = z.object({
    title: z.string().default("Document Summary"),
    summary: z.string().default("No summary generated."),
    keyPoints: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
})

/**
 * Summarize content using Groq's fast LLM (128k context window).
 * Automatically handles large multi-page documents, single texts, or transcripts.
 *
 * @param {string[]} chunks - Array of text sections/pages
 * @returns {Promise<{ title: string, summary: string, keyPoints: string[], keywords: string[] }>}
 */
export const AIsummarizer = async (chunks) => {
    if (!Array.isArray(chunks) || chunks.length === 0) {
        throw new ApiError(400, "No content provided to summarize")
    }

    const fullContent = chunks.join("\n\n---\n\n").trim()
    if (!fullContent) {
        throw new ApiError(400, "Content to summarize is empty")
    }

    const systemPrompt = `You are InBrief's elite AI content summarization engine.
Analyze the provided document or text thoroughly and return a well-structured JSON object.

Strict Rules:
- Output MUST be a valid JSON object matching this schema:
  {
    "title": "Clear, informative document title",
    "summary": "Dense, comprehensive, multi-paragraph summary preserving core arguments, numbers, names, and conclusions",
    "keyPoints": ["Key takeaway 1", "Key takeaway 2", ... (minimum 5 key points)],
    "keywords": ["Keyword1", "Keyword2", "Keyword3", "Keyword4", "Keyword5"]
  }
- "title" must be a non-empty string accurately describing the content.
- "summary" must be thorough, detailed, and directly answer what the content is about.
- "keyPoints" must have at least 5 meaningful, detailed bullet points.
- "keywords" must be an array of exactly 5 relevant strings.
- Never return empty strings or empty arrays.`

    // ── Primary Engine: Groq (ultra-fast, 128k context window) ──────────
    if (process.env.GROQ_API_KEY) {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
        const groqModels = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"]

        for (const model of groqModels) {
            try {
                console.log(`[AI Summarizer] Calling Groq with model: ${model} (content length: ${fullContent.length} chars)...`)
                const t0 = Date.now()
                const completion = await groq.chat.completions.create({
                    model,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Please summarize the following document:\n\n${fullContent}` },
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.1,
                })

                const rawJson = completion.choices[0]?.message?.content
                if (rawJson) {
                    const parsed = JSON.parse(rawJson)
                    const validated = summarySchema.parse(parsed)
                    console.log(`[AI Summarizer] ✅ Generated summary using ${model} in ${(Date.now() - t0) / 1000}s`)

                    // Ensure fields are genuinely populated
                    if (validated.summary && validated.summary.trim().length > 0) {
                        return {
                            title: validated.title || "AI-generated summary",
                            summary: validated.summary,
                            keyPoints: validated.keyPoints.length > 0 ? validated.keyPoints : ["Comprehensive document analysis complete"],
                            keywords: validated.keywords.length > 0 ? validated.keywords : ["Summary", "Document", "Overview", "Analysis", "Key Insights"],
                        }
                    }
                }
            } catch (groqErr) {
                console.warn(`[AI Summarizer] Groq model ${model} failed:`, groqErr.message || groqErr)
                // Continue to next Groq model in list
            }
        }
    }

    // ── Fallback Engine: OpenRouter LangChain ────────────────────────────
    console.log("[AI Summarizer] Falling back to OpenRouter...")
    try {
        const fallbackModel = new ChatOpenRouter({
            model: "openrouter/free",
            temperature: 0.1,
            apiKey: process.env.OPENROUTER_API_KEY,
        })
        const structuredModel = fallbackModel.withStructuredOutput(summarySchema)

        const finalSummary = await structuredModel.invoke([
            { role: "system", content: systemPrompt },
            { role: "user", content: fullContent.slice(0, 15000) }, // Limit for free OpenRouter
        ])

        if (finalSummary?.summary) {
            return finalSummary
        }
    } catch (openRouterErr) {
        console.error("[AI Summarizer] OpenRouter fallback error:", openRouterErr.message)
    }

    throw new ApiError(500, "AI summarization failed across all models. Please try again.")
}
