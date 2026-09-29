//import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { ChatOpenAI } from "@langchain/openai";

// import { ChatOllama } from "@langchain/ollama";

import { ChatOpenRouter } from "@langchain/openrouter";


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

		Summarize ONLY the provided section.

		Rules:
		- Preserve the original meaning and context.
		- Keep the most important facts, ideas, arguments, events, explanations,
		conclusions, names, dates, numbers, technical terms, definitions,
		and important examples.
		- Remove repetition, filler, unnecessary wording, and irrelevant details.
		- Use ONLY information explicitly present in the input.
		- Do not use external knowledge.
		- Do not add information or infer missing facts.
		- Do not make unsupported conclusions or predictions.
		- Do not guess or complete incomplete, truncated, unclear, or ambiguous information.
		- Keep the summary concise and information-dense.

		IMPORTANT:
		Return ONLY an object with exactly this structure:

		{
		"summary": "string"
		}

			The "summary" field MUST be a string.
			Do NOT create nested objects.
			Do NOT include type, topic, context, title, keyPoints, or keywords.
			`;
			
		const systemPrompt = `
				You are an AI content summarization assistant.

				Summarize ONLY the provided input.

				Rules:
				- Identify the main topic and purpose.
				- Generate a concise and accurate summary.
				- Extract the most important key points.
				- Generate exactly 5 relevant keywords.
				- Preserve important names, dates, numbers, facts, and technical terms.
				- Remove repetition, filler, and unnecessary details.
				- Preserve the original meaning and context.
				- Use ONLY explicitly provided information.
				- Do not use external knowledge.
				- Do not add or infer facts.
				- Do not make predictions.
				- Do not turn implications into confirmed facts.
				- Ignore incomplete, truncated, unclear, or ambiguous information rather than guessing.
				- Return ONLY the structured output required by the schema.

				The output must contain:
				- title: string
				- summary: string
				- keyPoints: array of strings
				- keywords: array of exactly 5 strings
				`;

			// const model = new ChatOllama({
			//   model: "qwen3:1.7b",
			//   temperature: 0,
			//   think: false,
			// }); 

			const model = new ChatOpenRouter({
				model: "openrouter/free",
				temperature: 0,
				
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
				batch.map(async (chunk, index) => chunkStructuredModel.invoke([
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

		console.log(`Chunk result:`, results);

		chunkSummaries.push(
			...results
				.filter(result => result && typeof result.summary === "string")
				.map(result => result.summary)
		);

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
             return "Model rate limit reached. Please retry after some time.";
    }
		 throw err;
	} 
};
