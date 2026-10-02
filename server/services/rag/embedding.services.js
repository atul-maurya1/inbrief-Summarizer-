import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import { QdrantVectorStore } from "@langchain/qdrant"
import { QdrantClient } from "@qdrant/js-client-rest"

const COLLECTION_NAME = "inbrief"
const VECTOR_SIZE = 768 // gemini-embedding-001 dimensions

/**
 * Ensure the Qdrant collection exists, creating it if needed.
 * Returns false if Qdrant is unreachable (so callers can skip gracefully).
 */
const ensureCollection = async () => {
    const client = new QdrantClient({ url: process.env.QDRANT_URL })

    let collections
    try {
        const result = await client.getCollections()
        collections = result.collections.map((c) => c.name)
    } catch (err) {
        // Qdrant is not running – warn and bail out
        console.warn("[Qdrant] Cannot connect to Qdrant at", process.env.QDRANT_URL, "– RAG chunking skipped.")
        console.warn("[Qdrant] Start Qdrant with: docker run -p 6333:6333 qdrant/qdrant")
        return false
    }

    if (!collections.includes(COLLECTION_NAME)) {
        console.log(`[Qdrant] Collection "${COLLECTION_NAME}" not found – creating it…`)
        await client.createCollection(COLLECTION_NAME, {
            vectors: {
                size: VECTOR_SIZE,
                distance: "Cosine",
            },
        })
        console.log(`[Qdrant] Collection "${COLLECTION_NAME}" created.`)
    }

    return true
}

/**
 * Generate embeddings for an array of LangChain Document chunks and store
 * them in Qdrant. Silently skips if Qdrant is unreachable.
 *
 * @param {import("@langchain/core/documents").Document[]} chunks
 */
export const embeddingGenerator = async (chunks) => {
    if (!Array.isArray(chunks) || chunks.length === 0) {
        console.warn("[Embeddings] No chunks to embed – skipping.")
        return
    }

    // 1. Make sure Qdrant is reachable and collection exists
    const qdrantReady = await ensureCollection()
    if (!qdrantReady) return   // Qdrant down – fail silently (it's fire-and-forget)

    // 2. Build embedding model
    const embeddingModel = new GoogleGenerativeAIEmbeddings({
        model: "gemini-embedding-001",  // 768 dimensions
        apiKey: process.env.GOOGLE_API_KEY,
    })

    // 3. Connect to the (now guaranteed) collection
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddingModel, {
        url: process.env.QDRANT_URL,
        collectionName: COLLECTION_NAME,
    })

    // 4. Store documents in batches to avoid timeout on large content
    const BATCH_SIZE = 50
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE)
        await vectorStore.addDocuments(batch)
        console.log(`[Embeddings] Stored batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} chunks)`)
    }

    console.log(`[Embeddings] ✅ All ${chunks.length} chunks stored in Qdrant.`)
}