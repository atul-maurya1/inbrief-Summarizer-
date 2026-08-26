import ApiResponse from "../utils/apiRespone.js"
export const healthCheck = async (req, res) => {
 
    res.status(200).json(
       new ApiResponse(200, "All is good")
    )
}