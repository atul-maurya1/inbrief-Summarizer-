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
            You are an AI content summarization assistant.

            Your task is to summarize ONLY the information explicitly provided
            in the input.

            The input may be:
            - Article
            - News article
            - Video transcript
            - Audio transcript
            - PDF
            - Document
            - Educational content
            - Research material
            - Business content
            - General text

            Rules:

            1. Identify the main topic and purpose of the content.
            2. Generate a concise and accurate summary.
            3. Extract the most important key points.
            4. Extract relevant keywords.
            5. Preserve important names, dates, numbers, facts and technical terms.
            6. Remove repetition, filler and unnecessary information.
            7. Maintain the original meaning and context.

            STRICT FACTUALITY RULES:

            8. NEVER add information that is not explicitly present in the input.
            9. NEVER use external knowledge or your prior knowledge.
            10. NEVER infer missing facts.
            11. NEVER predict what happens next.
            12. NEVER complete an incomplete sentence.
            13. NEVER assume what a truncated passage means.
            14. If the input ends abruptly, ignore the incomplete sentence.
            15. If a fact is unclear or incomplete, do not include it.
            16. Do not convert an implication into a confirmed fact.

            For example, if the input says:

            "the movement became strong enough to make a federal minister"

            DO NOT write:

            "the movement caused a federal minister's resignation."

            Instead, ignore the incomplete statement because the provided
            information does not establish what happened to the minister.

            Return the result strictly according to the structured output schema.
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
