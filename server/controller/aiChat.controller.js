// import {AIsummarizerchat} from '../services/ai/gemini.services.js'
// import ApiError from '../utils/apiError.js'
// import ApiResponse from '../utils/apiRespone.js'

// export const ChatToAI = async (req, res) =>{
//     try{
//         const {message} = req.body
//         console.log("req ", req.body)
//         if(!message) return

//         const data = await AIsummarizer(message)
//         if(!data){
//            throw new ApiError(400, "Error in AI model")
//         }

//         return res.status(200).json( new
//             ApiResponse(200,  {data: data}, "response successfully")
//         )

//     }
//     catch(e){

//         console.error("something went wrong ", e)

//     }    
// }