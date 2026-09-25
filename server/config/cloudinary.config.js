import { v2 as cloudinary } from 'cloudinary';
import fs from "fs/promises"

const pdfUploader =  async (pdfLocalPath) => {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    

try {
    // // 1. Determine resource type and format dynamically based on the file extension
    // const isPdf = pdfLocalPath.toLowerCase().endsWith('.pdf');
    // const resourceType = isPdf ? 'image' : 'video'; // Cloudinary treats PDFs as 'image'
    // const format = isPdf ? 'pdf' : 'mp4';

    // 2. Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(pdfLocalPath, {
        resource_type: 'image' || 'video', 
        folder: 'in-brief-files',  
        format: 'pdf' || 'mp4'     
    });

    console.log("Upload successful:", uploadResult.secure_url);

    // 3. Safely delete the local temporary file asynchronously
    await fs.unlink(pdfLocalPath);
    return uploadResult
} catch (error) {
    console.error("Error during upload or file cleanup:", error);
    
    try {
        await fs.unlink(pdfLocalPath);
    } catch (unlinkErr) {
        // File might not exist, safe to ignore
    }
}


}


export default pdfUploader