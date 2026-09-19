import apiClient from './apiClient.js'

export const getSummaryApi = async (fromData) =>{
    //console.log("data is ", fromData)
    const res = await apiClient.post('/summarizer/summarize-content', fromData)
    return await res.data
}