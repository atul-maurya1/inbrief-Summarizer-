import mongoose from "mongoose";

const summarySchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        summary: {
            type: String,
        },
        keyPoints: {
            type: [String],
        },
        keywords: {
            type: [String],
        },
        // Video/audio transcript – stored for RAG and display
        transcript: {
            type: String,
            default: null,
        },
        // Content type that produced this summary
        contentType: {
            type: String,
            enum: ["text", "pdf", "url", "video", "youtube"],
            default: null,
        },
    },
    { timestamps: true },
)

const Summary = mongoose.model("Summary", summarySchema)
export default Summary
