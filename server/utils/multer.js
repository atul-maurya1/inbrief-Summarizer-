import multer from "multer"
import fs from 'fs/promises'

export const uploader = multer({
    dest: "uploads/",
    
})