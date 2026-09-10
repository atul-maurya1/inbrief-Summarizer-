import apiClient from './apiClient.js'

export const signupApi = async (userData) => {
    const response = await apiClient.post('/auth/register', userData)
    return  response.data
}

export const loginApi = async (userData) => {
    const response = await apiClient.post('/auth/login', userData)
    return  response.data
} 

export const logoutApi = async () => {
     const response = await apiClient.post('/auth/logout')
     return  response.data
}
 
export const getCurrentUserApi = async () => {
     const response = await apiClient.get('/auth/me')
     return  response.data 
}


export const getSummery = async () =>{
   
}