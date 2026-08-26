import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import halmet from "helmet"
import rateLimiter from "express-rate-limit"
import hpp from "hpp"
import cors from "cors"
import ChatToAIRoutes from './routes/ChatToAI.routes.js'

import connectDB from './config/db.config.js'
import authRouter from './routes/auth.routes.js'
import summarizerRouter from './routes/summarizer.routes.js'

const app = express()

app.use(express.json())
app.use(cookieParser({limit: "20kb"}))
app.use(express.urlencoded({extended: true, limit: '10kb'}))
app.use(halmet())
app.use(hpp())
// app.use(mongoSanitize())
app.use(rateLimiter({
     windowMs: 15 * 60 * 1000,
     limit: 100,
     message: "Too many request, please try again later"
}))

app.use(
  cors({
    origin: [
      "http://localhost:5173"
    ],
  })
);


app.get("/", (req, res) => {
    res.send("Running")
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/summarizer', summarizerRouter)

app.use('/api', ChatToAIRoutes)



const PORT = process.env.PORT


await connectDB()
app.listen(PORT, () => {
 console.log(`Server is running on http://localhost:${PORT}`);
});

