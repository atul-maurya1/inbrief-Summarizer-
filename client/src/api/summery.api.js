import apiClient from "./apiClient.js"

export const getSummaryApi = async (formData) => {
    const response = await apiClient.post("/summarizer/summarize-content", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 600000, // 10 minutes for large video/PDF uploads and transcription
    })
    return response.data
}

export const askAiApi = async (contentId, userQuery) => {
    const response = await apiClient.post(
        "/ai/ask-ai",
        { userQuery },
        { params: { contentId }, timeout: 120000 }
    )
    return response.data
}