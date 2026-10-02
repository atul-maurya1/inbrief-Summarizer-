import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload a local file to Cloudinary.
 *
 * @param {string} localPath - Local file path
 * @param {object} [options]  - Extra Cloudinary upload options (e.g. resource_type)
 * @returns {Promise<import('cloudinary').UploadApiResponse>}
 */
const cloudinaryUploader = async (localPath, options = {}) => {
    if (!localPath) throw new Error("No local file path provided to Cloudinary uploader")

    const ext = localPath.toLowerCase()
    const isPdf = ext.endsWith(".pdf")
    const isVideo = !isPdf

    const defaultOptions = {
        folder: "in-brief-files",
        resource_type: isVideo ? "video" : "image",
        ...(isPdf && { format: "pdf" }),
    }

    const uploadResult = await cloudinary.uploader.upload(localPath, {
        ...defaultOptions,
        ...options,
    })

    return uploadResult
}

export default cloudinaryUploader