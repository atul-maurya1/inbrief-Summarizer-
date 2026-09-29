// import { ChatOllama } from "@langchain/ollama";
import { ChatOpenRouter } from "@langchain/openrouter";

import ApiError from '../utils/apiError.js'
import ApiResponse from '../utils/apiRespone.js'

export const ChatToAI = async (req, res) =>{
   
    try{
         const {inputMsg} = req.body
         if(!inputMsg) return

     const model = new ChatOpenRouter({
			   model: "openrouter/free",
				temperature: 0,
				
			});


       const response = await model.invoke(inputMsg)

       //console.log("model response is ", response.content)
        return res.status(200).json( new
            ApiResponse(200,  {content: response.content}, "response successfully")
        )

    }
    catch(e){

        console.error("something went wrong ", e)

    }    
}