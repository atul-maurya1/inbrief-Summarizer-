import { ChatOpenRouter } from "@langchain/openrouter"
import ApiResponse from "../utils/apiRespone.js"
import ApiError from "../utils/apiError.js"

export const ChatToAI = async (req, res, next) => {
    try {
        const { inputMsg } = req.body
        if (!inputMsg || typeof inputMsg !== "string" || !inputMsg.trim()) {
            return res.status(400).json(new ApiResponse(400, null, "Message is required"))
        }

        const model = new ChatOpenRouter({
            model: "openrouter/free",
            temperature: 0,
            apiKey: process.env.OPENROUTER_API_KEY,
        })

        const response = await model.invoke(inputMsg.trim())

        return res.status(200).json(
            new ApiResponse(200, { content: response.content }, "Response generated successfully")
        )
    } catch (e) {
        console.error("ChatToAI error:", e.message || e)
        return res.status(500).json(new ApiResponse(500, null, "Failed to generate AI response. Please try again."))
    }
}