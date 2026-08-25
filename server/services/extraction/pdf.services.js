import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {AIsummarizer} from '../ai/gemini.services.js'

export const extractTextFromPdf = async (filePath) => {

    try{
       const loader = new PDFLoader(filePath)
       const docs = await loader.load()

       let cleanDocs = []
       docs.map((doc) => {
          cleanDocs.push(`
            "content" ${doc.pageContent}, 
             "source": ${doc.metadata.source},
             "page": ${doc.metadata.loc.pageNumber}
            `)
        }).join("\n\n");

        //console.log(cleanDocs)
        return await AIsummarizer(cleanDocs)  

    }catch(err){
       console.log(err)
        throw err;
    }

}