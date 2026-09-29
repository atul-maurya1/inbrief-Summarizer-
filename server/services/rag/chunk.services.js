import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import {embeddingGenerator} from './embedding.services.js'

export const pdfChunking = async (pdfUrl, userId, contentId) => {
    try{
        
        console.log("user is ", userId, "content ", contentId)

        const response = await fetch(pdfUrl); // Fetch the PDF and response object

        const buffer = await response.arrayBuffer(); //convert response into binary data

        const blob = new Blob([buffer], { // Take this binary data and package it as a (web-standard) file-like object.
            type: "application/pdf"  // data represents a PDF.  
        });

       const loader = new PDFLoader(blob) // parse the PDF and extract its text.
       const docs = await loader.load()  // convert into doc

       const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 })
       const chunks = await splitter.splitDocuments(docs);

        chunks.forEach((chunk, index) => {
              chunk.metadata = { ...chunk.metadata,
                userId: userId.toString(),
                contentId: contentId.toString(),
                contentType: "pdf",
                chunkIndex: index
            };
        });
         console.log("docs ", chunks)
           console.log("docs ", chunks.metadata)

        await embeddingGenerator(chunks)
    
    }catch(err){
       console.log(err)
        throw err;
    }

}

export const textChunking = async (text, userId, contentId) => {
   try{

      const document = new Document({
            pageContent: text,
            metadata: {
                userId: userId.toString(),
                contentId: contentId.toString(),
                contentType: "text"
            }
        });

      const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 })
      const chunks = await splitter.splitDocuments([document]);

        chunks.forEach((chunk, index) => {
            chunk.metadata.chunkIndex = index;

        });
       await embeddingGenerator(chunks)
        //  console.log("docs ", chunks)
        //  console.log("docs ", chunks.metadata)


   }catch(err){
    console.log(err)
    throw err;
   }
}