import multer from "multer"
import path from "path"
import fs from "fs"
import ApiError from "./apiError.js"

// Ensure uploads directory exists
const uploadDir = "uploads"
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir)
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`)
    },
})

const ALLOWED_MIMETYPES = new Set([
    "application/pdf",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
    "video/mpeg",
])

const fileFilter = (_req, file, cb) => {
    if (ALLOWED_MIMETYPES.has(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new ApiError(400, `File type "${file.mimetype}" is not supported. Please upload a PDF or video file.`), false)
    }
}

export const uploader = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB max
        files: 1,
    },
})

/**
 * Safely delete a file from disk (fire-and-forget, no throw)
 */
export const deleteFile = (filePath) => {
    if (!filePath) return
    fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
            console.error(`[Multer] Failed to delete temp file: ${filePath}`, err)
        }
    })
}