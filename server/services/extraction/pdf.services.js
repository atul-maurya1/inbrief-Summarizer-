import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {AIsummarizer} from '../ai/ai.services.js'


export const extractTextFromPdf = async (pdfUrl) => {
    try{
      
        const response = await fetch(pdfUrl); // Fetch the PDF and response object

        const buffer = await response.arrayBuffer(); //convert response into binary data

        const blob = new Blob([buffer], { // Take this binary data and package it as a (web-standard) file-like object.
            type: "application/pdf"  // data represents a PDF.  
        });

       const loader = new PDFLoader(blob) // parse the PDF and extract its text.
       const docs = await loader.load()  // convert into doc

     

       let cleanDocs = []
       docs.map((doc) => {
          cleanDocs.push(`
            "content" ${doc.pageContent}, 
             "source": ${doc.metadata.source},
             "page": ${doc.metadata.loc.pageNumber}
            `)
        }).join("\n\n");

        return await AIsummarizer(cleanDocs)  
    
    }catch(err){
       console.log(err)
        throw err;
    }

}