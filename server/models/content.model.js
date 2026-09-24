import mongoose from "mongoose"

const contentSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true
    },
    title: {
        type: String,
       required: true
    },
    contentType: {
        type: String,
        enum: [
            "text",
            "pdf",
            "youtube",
            "audio",
            "video",
            "website"
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
       ref: "Summery"
       
    }
    


},{timestamps: true})

const Content = mongoose.model("Content", contentSchema)
export default Content