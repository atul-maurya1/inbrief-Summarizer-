import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiRespone.js";
import textServices  from "../services/extraction/text.services.js"
import {extractTextFromPdf} from "../services/extraction/pdf.services.js"
import {urlService} from '../services/extraction/url.services.js'
import pdfUploader from '../config/cloudinary.config.js'

export const summarizeContent  = async (req, res, next) => {    
    try {
        const userId = req.user.id
		const { text, url } = req.body;
      
        if (!text && !url && !req.file) { // Check whether ANY input exists
            throw new ApiError(400, "Please provide an input");
        }

       

        let response    
		if (text) {
			 console.log("text");
             response =  await textServices(text)  
		}
	    if (url) { 
				console.log("url");
                response = await urlService(url)
		}

		if (req.file) {
			 if (req.file.mimetype === "application/pdf") {
			   const res = await pdfUploader(req?.file?.path)
               response = await extractTextFromPdf(res.secure_url)
			}

			if (req.file.mimetype === "video/mp4") {
					console.log("vedio"); 
			  }
			}

         //   console.log(response)
            // history.summary.title = response?.title
            // history.summary.summery = response?.summary
            // await history.save()

        return res.status(200).json(
             new ApiResponse(200, response, "summery generated suucessfully")
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






export const linkContentSummarizer = async (req, res, next) => {
    const {link} = req.body
};

export const videoSummarizer = async (req, res, next) => {};
 