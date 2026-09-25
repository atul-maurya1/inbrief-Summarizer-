import express from "express"

const summarizerRouter = express.Router()

import {uploader} from '../utils/multer.js'
import {verifyJWT} from '../middleware/auth.middleware.js'


import {summarizeContent, history, historyContent} from '../controller/summerizes.controller.js'

summarizerRouter
               .post('/summarize-content', verifyJWT, uploader.single('file'), summarizeContent)
               .get('/history', verifyJWT , history)
               .get('/history-content', verifyJWT, historyContent)

export default summarizerRouter   