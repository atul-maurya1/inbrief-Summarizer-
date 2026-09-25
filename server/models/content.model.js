import mongoose from "mongoose"

const contentSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true
    },
    title: {
        type: String
    },
    url: {  // website url
        type: String,
      
    },
    contentType: {
        type: String,
        enum: [
            "text",
            "pdf",
            "youtube",
            "video",
            "url"
        ],
       required: true
    },

    text: {
        type: String
    },

    fileUrl: {
        type: String
    },

    originalFileName: {
        type: String
    },

    summary: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Summary"
       
    }
    


},{timestamps: true})

const Content = mongoose.model("Content", contentSchema)
export default Content