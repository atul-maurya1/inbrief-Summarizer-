//import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { ChatOpenAI } from "@langchain/openai";

import ApiError from "../../utils/apiError.js"
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

export const AIsummarizer = async (chunks) => {
	try {
	
		const summarySchema = z.object({
			title: z.string(),
			summary: z.string(),
			keyPoints: z.array(z.string()),
			keywords: z.array(z.string()),
		});

		const chunkSchema = z.object({
			summary: z.string(),
		});

		const chunkSystemPrompt = `
		You are an AI content summarization assistant.

		Your task is to accurately summarize the information contained
		ONLY in the provided section.

		The input may be any type of content, including but not limited to:

		- News articles
		- Study material
		- Lecture notes
		- Educational content
		- Research papers
		- Books or book chapters
		- Blogs
		- Documentation
		- Reports
		- Business documents
		- Meeting transcripts
		- Interviews
		- Speeches
		- Video transcripts
		- Audio transcripts
		- Technical content
		- General text
		- Other informational content

		Do not assume the type, purpose, or subject of the content.
		Determine the nature and context from the provided content itself.

		IMPORTANT RULES:

		1. Summarize ONLY information explicitly present in the input.

		2. Preserve the original meaning and context.

		3. Identify and retain the most important information,
		ideas, arguments, facts, events, explanations, or conclusions
		relevant to the provided section.

		4. Preserve important:
		- Names
		- Dates
		- Numbers
		- Facts
		- Technical terms
		- Definitions
		- Arguments
		- Conclusions
		- Important examples

		5. Remove:
		- Repetition
		- Filler
		- Unnecessary wording
		- Irrelevant details

		6. NEVER use external knowledge.

		7. NEVER add information that is not present in the input.

		8. NEVER infer or assume missing facts.

		9. NEVER make predictions or conclusions that are not supported
		by the provided content.

		10. If the section ends in the middle of a sentence because of
			chunking, do not complete or guess the missing information.

		11. If information is unclear, incomplete, or ambiguous,
			do not invent an interpretation.

		12. Maintain the tone and meaning of the original content
			without adding personal opinions.

		13. The summary should be concise but information-dense.

		14. Focus on the information that would be most useful for
			understanding this section.

		Return ONLY the structured output requested by the schema.
		`;

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
            4. Extract most relevant 5 keywords.
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
		const model = new ChatGroq({
			model: "openai/gpt-oss-120b",
           
		});

		const structuredModel = model.withStructuredOutput(summarySchema);
		const chunkStructuredModel = model.withStructuredOutput(chunkSchema)

		let finalSummery
		if(chunks.length === 1){
		    finalSummery =  await structuredModel.invoke([
			 {
				role: "system",
				content: systemPrompt,
			 },
			 {
				role: "user",
				content: chunks[0],
			 },
		]); 

		}else{	
		  const chunkSummaries = [];

    	  // batch processing
		const CONCURRENCY = 5;
		for(let i = 0; i < chunks.length; i += CONCURRENCY){
			const batch = chunks.slice(i, i + CONCURRENCY);
			
			// 5 chunks process in parallel
			const results = await Promise.all(
				batch.map((chunk) => chunkStructuredModel.invoke([
			{
				role: "system",
				content: chunkSystemPrompt,
			},
			{
				role: "user",
				content: chunk,
			},
		]))
			)

		chunkSummaries.push(...results.map(result  =>  result.summary));

		}
		  
		const combinedSummary = chunkSummaries.join("\n\n");

	    finalSummery = await structuredModel.invoke([
			{
				role: "system",
				content: systemPrompt,
			},
			{
				role: "user",
				content: combinedSummary,
			},
		]);
   }

		return finalSummery;

	} catch (err) {
		//console.error("error while model-running ", err);
		  if (err.status === 429) {
			//throw new ApiError(429, "Model rate limit reached. Please retry.")
             return "Groq Model rate limit reached. Please retry after some time.";
    }
		 throw err;
	} 
};
