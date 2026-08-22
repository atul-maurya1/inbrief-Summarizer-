import Content from "../models/content.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiRespone.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { AIsummarizer } from "../services/ai/gemini.services.js";

export const textSummarizer = async (req, res, next) => {
	try {
		const { text } = req.body;
        if(!text){
            throw new ApiError(400, "Text is required")
        }
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 500, // Maximum characters per chunk
			chunkOverlap: 100, // reuse around 100 characters from the previous chunk.
		});

		const chunks = await splitter.splitText(text);
		const response = await AIsummarizer(text);

        return res.status(200).json(
             new ApiResponse(200, response, "summery generated suucessfully")
        )
		
	} catch (err) {
         console.error("error while text-summarizer ", err)

         if(err instanceof ApiError){
          next(err)
         }
       throw new ApiError(500, "Internal server error")
    }
};




export const pdfSummarizer = async (req, res, next) => {};

export const linkContentSummarizer = async (req, res, next) => {};

export const videoSummarizer = async (req, res, next) => {};
