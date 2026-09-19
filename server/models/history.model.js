import mongoose from "mongoose"

const historySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    contentType: {
        type: String,
        enum: ["pdf", "website", "youtube", "audio", "video", "text"],
    },
    source: {
            file: {
                public_id: String,
                secure_url: String,
                original_filename: String,
                resource_type: String
            },

            text: String,

            url: String
        },
    
 summary: {
    title: {
        type: String
    },
    summery: {
        String
    },

    keyPoints: {
        type: [String]
    },

    importantTerms: {
        type: [String]
    },
}

}, {timestamps: true})

const History = mongoose.model("History", historySchema)
export default History