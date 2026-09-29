import ApiError from '../utils/apiError.js'
import {retrievalChunks} from '../services/rag/retrieval.services.js'
import Content from '../models/content.model.js'
import ApiResponse from "../utils/apiRespone.js";

export const askAI = async (req, res) => {
    try {
        const { contentId } = req.query;
        const { userQuery } = req.body;

        console.log("contentId:", contentId);
        console.log("userQuery:", userQuery);

        if (!contentId) {
            return res.status(400).json({
                success: false, 
                message: "Content ID is required"
            });
        }

        if (!userQuery) {
            return res.status(400).json({
                success: false,
                message: "User query is required"
            });
        }


       const content = await Content.findById(contentId)
       if(!content){
          return res.status(400).json({
                success: false,
                message: "content not found"
            });
       }

    const response =  await retrievalChunks(contentId, userQuery)
    console.log("response ", response)
    return res.status(200).json(
       new ApiResponse(200, response, "response comes successfully")
    )


    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};