import express from "express"

const summarizerRouter = express.Router()

import {textSummarizer} from '../controller/summerizes.controller.js'

summarizerRouter
               .post('/text', textSummarizer)

export default summarizerRouter