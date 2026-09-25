import apiClient from './apiClient.js'


export const getHistoryListApi = async () => {
    const response = await apiClient.get('/summarizer/history')
    return await response.data
}