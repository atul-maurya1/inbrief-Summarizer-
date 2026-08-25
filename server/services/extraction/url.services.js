//import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import Firecrawl from "@mendable/firecrawl-js";
import { AIsummarizer } from "../ai/gemini.services.js"

export const urlService = async (url) => {
    try{
       const firecrawl = new Firecrawl({
       apiKey: process.env.FIRECRAWL_API_KEY,
    });
      const result = await firecrawl.scrape(url, {
            formats: ["markdown"],
    });
    
 //    console.log(typeof result.markdown)

     const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 3000, 
        chunkOverlap: 300, 
     })

     const chunks = await splitter.splitText(result.markdown)
    
     return await AIsummarizer(chunks)
    
    }catch(err){
        console.error("error in url service ", err)
        throw err
    }
} 