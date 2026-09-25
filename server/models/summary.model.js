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
	},
	{ timestamps: true },
);

const Summary = mongoose.model("Summary", summarySchema);
export default Summary;
