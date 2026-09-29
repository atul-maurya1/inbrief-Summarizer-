import apiClient from './apiClient.js'

export const getSummaryApi = async (fromData) =>{
    //console.log("data is ", fromData)
    const response = await apiClient.post('/summarizer/summarize-content', fromData)
    console.log("response ", response)
    return await response.data
}


export const askAiApi = async (contentId, userQuery) => {
    const response = await apiClient.post(
        "/ai/ask-ai",
        { userQuery },
        {
            params: {
                contentId
            }
        }
    );

    return response.data;
};