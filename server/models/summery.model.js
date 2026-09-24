import mongoose from "mongoose"

const summerySchema = new mongoose.Schema({

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
    

},{timestamps: true})

const Summery = mongoose.model("Summery", summerySchema)
export default Summery