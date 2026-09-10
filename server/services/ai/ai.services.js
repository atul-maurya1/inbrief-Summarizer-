//import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { ChatOpenAI } from "@langchain/openai";

import { ChatOllama } from "@langchain/ollama";


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

		Summarize ONLY the provided section. Determine its type, topic, and context from the content itself.

		Rules:
		- Preserve the original meaning and context.
		- Keep the most important facts, ideas, arguments, events, explanations, conclusions, names, dates, numbers, technical terms, definitions, and important examples.
		- Remove repetition, filler, unnecessary wording, and irrelevant details.
		- Use ONLY information explicitly present in the input.
		- Do not use external knowledge, add information, infer missing facts, make unsupported conclusions, or predictions.
		- Do not complete, guess, or interpret incomplete, truncated, unclear, or ambiguous information.
		- Keep the summary concise and information-dense.
		- Return ONLY the structured output required by the schema.
		`;

		const systemPrompt = `
			You are an AI content summarization assistant.

			Summarize ONLY the provided input. Determine its topic and purpose from the content itself.

			Rules:
			- Identify the main topic and purpose.
			- Generate a concise, accurate summary.
			- Extract the most important key points and 5 relevant keywords.
			- Preserve important names, dates, numbers, facts, and technical terms.
			- Remove repetition, filler, and unnecessary details.
			- Preserve the original meaning and context.
			- Use ONLY explicitly provided information.
			- Do not use external knowledge, add or infer facts, make predictions, or turn implications into confirmed facts.
			- Ignore incomplete, truncated, unclear, or ambiguous information rather than guessing or completing it.
			- Return ONLY the structured output required by the schema.
			`;

			const model = new ChatOllama({
			  model: "qwen3:1.7b",
			  temperature: 0,
			  think: false,
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
