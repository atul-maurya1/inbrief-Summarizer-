import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";


export const AIsummarizer = async (text) => {
	try {
		const summarySchema = z.object({
			title: z.string(),
			summary: z.string(),
			keyPoints: z.array(z.string()),
			keywords: z.array(z.string()),
		});

		const systemPrompt = `
            You are an expert text summarization assistant.

            Your task is to summarize the provided text accurately and concisely.

            Follow these rules:

            1. Understand the complete context of the provided text.
            2. Do not add information that is not present in the text.
            3. Remove unnecessary repetition and filler content.
            4. Preserve important facts, concepts, definitions, examples, and technical terms.
            5. Make the summary easy to understand.
            6. Extract the most important key points.
            7. Extract important keywords from the text.
            8. If the text contains technical concepts, preserve the correct technical terminology.
            9. Do not hallucinate or assume missing information.
            10. Return the result strictly according to the provided structured output schema.

            The summary should be suitable for a student who wants to quickly revise the topic.
            `;

		const model = new ChatGoogleGenerativeAI({
			model: "gemini-2.5-flash",
		});

		const structuredModel  = await model.withStructuredOutput(summarySchema)
		const response = await structuredModel.invoke([
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: text,
            },
        ]);
 
        return response

	} catch (e) {
         console.error("error while model-running ", err)
         return res.status(500).json({
            suucess: false,
            message:  "Internal server errror"
         })
	}
};
