import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimiter from "express-rate-limit"
import hpp from "hpp"
import cors from "cors"
import path from "path"

import connectDB from './config/db.config.js'
import authRouter from './routes/auth.routes.js'
import summarizerRouter from './routes/summarizer.routes.js'
import healthRouter from './routes/health.routes.js'
import ChatToAIRoutes from './routes/ChatToAI.routes.js'
import askAIRouter from './routes/askAi.routes.js'

const app = express()

// Security middleware
app.use(helmet())
app.use(hpp())

// CORS – driven by env so works in prod and dev
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim())

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (curl, Postman, etc.) or matching origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error(`CORS: origin "${origin}" not allowed`))
        }
    },
    credentials: true,
}))

// Body parsing
app.use(express.json({ limit: "10mb" }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Rate limiting
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." },
}))

// Health check
app.get("/", (_req, res) => {
    res.json({ success: true, message: "InBrief API running", timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/summarizer', summarizerRouter)
app.use('/api/v1', healthRouter)
app.use('/api/v1/ai', ChatToAIRoutes)
app.use('/api/v1/ai', askAIRouter)

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" })
})

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    const statusCode = err.statusCode || err.status || 500
    const message = err.message || "Internal server error"
    console.error(`[Error] ${statusCode} – ${message}`, err.stack ? `\n${err.stack}` : "")
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    })
})

const PORT = parseInt(process.env.PORT, 10) || 8000

await connectDB()
app.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`)
})
