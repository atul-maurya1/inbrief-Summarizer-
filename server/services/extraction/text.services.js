import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { AIsummarizer } from "../ai/gemini.services.js"

 

const textServices = async (text) => {
    try{    
        const splitter = new RecursiveCharacterTextSplitter({  
        chunkSize: 1000, // Maximum characters per chunk
        chunkOverlap: 100, // reuse around 100 characters from the previous chunk.
     });
                 
    const chunks = await splitter.splitText(text);
    return await AIsummarizer(chunks);
         
    }catch(err){

        console.error("error in text service ", err)
        
    }
}

export default textServices