import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";


export const embeddingGenerator = async (chunks) => {
    try{
        const embeddingModel = new GoogleGenerativeAIEmbeddings({
            model: "gemini-embedding-001", // 768 dimensions
            
        })
           const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddingModel,
            {
                url: "http://localhost:6333",
                collectionName: "inbrief"
            }
    );

    await vectorStore.addDocuments(chunks)
    console.log("All doc are store in vector store")
        
 
    }catch(err){
        console.log(err) 
        throw err;
    }
} 
 