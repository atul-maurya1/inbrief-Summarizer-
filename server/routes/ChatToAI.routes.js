import express from "express"
import {ChatToAI} from '../controller/aiChat.controller.js'

const ChatToAIRoutes = express.Router()

ChatToAIRoutes.post("/chat-ai", ChatToAI)


export default ChatToAIRoutes