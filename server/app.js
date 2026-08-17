import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import halmet from "helmet"
import rateLimiter from "express-rate-limit"
import hpp from "hpp"
import mongoSanitize from "express-mongo-sanitize"

const app = express()

app.use(express.json({limit: '10kb'}))
app.use(cookieParser({limit: "20kb"}))
app.use(express.urlencoded({extended: true, limit: '10kb'}))
app.use(halmet())
app.use(hpp())
app.use(mongoSanitize())
app.use(rateLimiter({
     windowMs: 15 * 60 * 1000,
     limit: 100,
     message: "Too many request, please try again later"
}))

app.get("/", (req, res) => {
    res.send("Running")
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})


