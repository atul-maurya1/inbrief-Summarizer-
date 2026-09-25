import apiClient from './apiClient.js'


export const getHistoryListApi = async () => {
    const response = await apiClient.get('/summarizer/history')
    return await response.data
}

export const getHistoryContentApi = async (summaryId, contentId) => {
     const response = await apiClient.get(`/summarizer/history-content?summaryId=${summaryId}&contentId=${contentId}`);
      return await response.data
}