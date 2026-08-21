import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const AIchat = async (message) => {
    try{

        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash"
        })

        const response = await model.invoke(message)
        console.log("bot: ", response.content)
        return response.content
    }catch(e){

        console.log("Error ", e)

    }
}
