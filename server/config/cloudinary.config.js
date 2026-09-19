import { v2 as cloudinary } from 'cloudinary';
import fs from "fs/promises"

const pdfUploader =  async (pdfLocalPath) => {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader.upload( pdfLocalPath, {
              resource_type: 'image', // Allows page-based transformations
              folder: 'in-brief-files',  
              format: "pdf"     
           }
       )
       fs.unlink(pdfLocalPath)
       .catch((error) => {
           console.log(error); 
       });

    return uploadResult
}


export default pdfUploader