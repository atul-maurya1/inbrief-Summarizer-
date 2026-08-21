import mongoose from "mongoose";

const aiChatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        chat: [{
            userQuestion: {
            type: String,
            required: true
        },
         aiResponse: {
            type: String,
            required: true
        }
    }]        
    },
    {
        timestamps: true
    }
);

const AIChat = mongoose.model("AIChat", aiChatSchema);

export default AIChat;