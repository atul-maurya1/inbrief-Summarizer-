import express from "express"

const askAIRouter = express.Router()

import {verifyJWT} from '../middleware/auth.middleware.js'
import {askAI} from "../controller/askAi.controller.js"

askAIRouter.post('/ask-ai' , verifyJWT, askAI)


export default askAIRouter