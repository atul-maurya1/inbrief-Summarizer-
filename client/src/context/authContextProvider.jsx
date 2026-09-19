import {authContext} from "./authContext.js"
import {
    loginApi,
    signupApi,
    logoutApi,
    getCurrentUserApi
} from '../api/auth.api.js'

import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";



export const AuthContextProvider = ({children}) => {
     const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState("")

useEffect(() => {
    const checkAuth = async () => {
        try {
            setLoading(true);

            const data = await getCurrentUserApi();

            setUser(data);

        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    checkAuth(); // 👈 you were missing this
}, [navigate]);


    const signUp = async(firstName, lastName, email, password, confirmPassword) => {
        try{
            setLoading(true)
            const response = await signupApi({
                firstName, lastName, email, password, confirmPassword
            })

          //  console.log("sign up ", response.data)
            setUser(response.data)
            return response

        }catch(err){
            console.log("error while sign up ", err) 
            console.log("STATUS:", err.response?.status);
        console.log("RESPONSE:", err.response?.data);

        }finally{
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try{
            setLoading(true)
            const response = await loginApi({email, password})
         //   console.log("login ", response.data)

            setUser(response.data)
            return response

        }catch(err){
            console.log("error while login ", err)
           // setErrors|(err.data)
        }finally{
            setLoading(false)
        }
    
    }
      

    const logout = async () => {
        try{
            setLoading(true)
            const response = await logoutApi()
            setUser(null)
        }catch(err){
          console.log("error while logout ", err)
        }finally{
            setLoading(false)
        }
    }

    return(
        <authContext.Provider value = {{
            signUp,
            login,
            logout,
            loading,
            user,
            errors,
        }}>
           {children}
        </authContext.Provider>
    )
}