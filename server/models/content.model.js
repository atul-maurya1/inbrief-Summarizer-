import mongoose from "mongoose"

const contentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    contentType: {
        type: String,
        enum: ["pdf", "website", "youtube", "audio", "video", "text"],
    },
    content: {
        public_id: String,
        secure_url: String
    },
    text: {
        type: String
    },
    
    summary: {
    overview: {
        type: String
    },

    keyPoints: {
        type: [String]
    },

    importantTerms: {
        type: [String]
    },
}

}, {timestamps: true})

const Content = mongoose.model("Content", contentSchema)
export default Content