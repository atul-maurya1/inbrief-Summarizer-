
import {healthCheck} from "../controller/health.controller.js"
import express from "express"

const healthRouter = express.Router()

healthRouter
           .get("/health", healthCheck)

export default healthRouter           