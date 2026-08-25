import express from "express"

const summarizerRouter = express.Router()

import {uploader} from '../utils/multer.js'

import {summarizeContent} from '../controller/summerizes.controller.js'

summarizerRouter
               .post('/summarize-content', uploader.single('file'), summarizeContent)

export default summarizerRouter 