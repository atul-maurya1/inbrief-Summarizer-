import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiRespone.js";
import textServices  from "../services/extraction/text.services.js"
import {extractTextFromPdf} from "../services/extraction/pdf.services.js"
import {urlService} from '../services/extraction/url.services.js'
import pdfUploader from '../config/cloudinary.config.js'
import Content from '../models/content.model.js'
import Summary from '../models/summary.model.js'
import mongoose from "mongoose"

export const summarizeContent  = async (req, res, next) => {    
    try {
        const userId = req.user.id
		const { text, url } = req.body;
      
       // console.log("Req ", req.file)

        if (!text && !url && !req.file) { // Check whether ANY input exists
            throw new ApiError(400, "Please provide an input");
        }
        let response      
		if (text) {
			 console.log("text");
             response =  await textServices(text) 
             
            const summary = await Summary.create(response)
            console.log("id is ", summary._id)
         
            const content = await Content.create({
              user: userId,
              text,
              contentType: "text", 
              summary: summary._id,
              title: summary.title
              })
             
		}
	    if (url) { 
				console.log("url");
                response = await urlService(url)  
                
                const summary = await Summary.create(response)
                console.log("id is ", summary._id)
         
                const content = await Content.create({
                user: userId,
                url,
                contentType: "url", 
                summary: summary._id,
                title: summary.title
              })

              console.log("content : ", content) 
                
		}

		if (req.file) {
			 if (req.file.mimetype === "application/pdf") {
			    const res = await pdfUploader(req?.file?.path)
                response = await extractTextFromPdf(res.secure_url )

                const summary = await Summary.create(response)
                console.log("id is ", summary._id)
         
                const content = await Content.create({
                user: userId,
                originalFileName: req?.file?.originalname,
                fileUrl: res?.secure_url,
                contentType: "pdf", 
                summary: summary._id,
                title: summary.title
              })

		}

            if (req.file.mimetype === "video/mp4") { 
                  console.log(req?.file?.path)
                  const res = await pdfUploader(req?.file?.path) 
                   console.log("vedio ", res);
			  }
			}

         //   console.log(response)
            // history.summary.title = response?.title
            // history.summary.summery = response?.summary
            // await history.save()

        return res.status(200).json(
             new ApiResponse(200, response, "summary generated suucessfully")
        )
		

		} catch (err) {
          console.error("Error while summarizer content :", err); 

        if (err instanceof ApiError) {
            return next(err);
        }

        return next(
            new ApiError(500, "Internal server error")
        );
        }
      
};


export const history = async (req, res, next ) => {
    try{
        const userId = req.user.id
        const history = await Content.aggregate([
           {
            $match: {user: new mongoose.Types.ObjectId(userId) }
           },
           {
            $project: { 
               _id: 1,
               title: 1,
               summary: 1,
               contentType: 1
            }
           }
           
        ])

        // console.log(history)

        return res.status(200).json(
             new ApiResponse(200, history, "history fetched suucessfully")
        )

    }catch(err){

        console.error("Error while fetching history :", err); 

        if (err instanceof ApiError) {
            return next(err);
        }

        return next(
            new ApiError(500, "Internal server error")
        );

    }

}

export const historyContent = async (req, res, next) => {

    try{
         const summaryId =  req.query.summaryId
         const contentId = req.query.contentId

         if(!summaryId || !contentId){
             return res.status(400).json(
               new ApiError(400, "history not found")
        )
         }

         console.log(`contentId ${contentId} -- summeryId ${summaryId}`)

         const summary = await Summary.findById(summaryId)
         const content = await Content.findById(contentId)

        if (!summary || !content) {
            return res.status(404).json(
                new ApiError(404, "History content not found")
            );
        }

         const history = { summary, content}
 
         console.log("history ", history)

         return res.status(200).json(
               new ApiResponse(200, history, "history fetch successfully")
         )
       

    }catch(err){
         console.error("Error while fetching history content :", err); 

        if (err instanceof ApiError) {
            return next(err);
        }

        return next(
            new ApiError(500, "Internal server error")
        );
    }

}