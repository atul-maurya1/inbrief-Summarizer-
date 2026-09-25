import apiClient from './apiClient.js'

export const getSummaryApi = async (fromData) =>{
    //console.log("data is ", fromData)
    const response = await apiClient.post('/summarizer/summarize-content', fromData)
    return await response.data
}
