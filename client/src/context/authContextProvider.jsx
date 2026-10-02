import { authContext } from "./authContext.js"
import {
    loginApi,
    signupApi,
    logoutApi,
    getCurrentUserApi,
} from "../api/auth.api.js"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const AuthContextProvider = ({ children }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState("")

    // Helper – always store the plain user object (not the ApiResponse wrapper)
    const setUserFromResponse = (apiResponse) => {
        // ApiResponse shape: { statusCode, data: userObj, message, success }
        // We always want to store the inner `data` (the actual user document)
        const userObj = apiResponse?.data ?? apiResponse
        setUser(userObj)
    }

    // Check if user is already logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true)
                const apiResponse = await getCurrentUserApi()
                setUserFromResponse(apiResponse)
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        checkAuth()
    }, [])

    const signUp = async (firstName, lastName, email, password, confirmPassword) => {
        try {
            setLoading(true)
            setErrors("")
            const apiResponse = await signupApi({ firstName, lastName, email, password, confirmPassword })
            setUserFromResponse(apiResponse)
            return apiResponse
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Sign up failed. Please try again."
            setErrors(message)
            return { success: false, message }
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            setLoading(true)
            setErrors("")
            const apiResponse = await loginApi({ email, password })
            setUserFromResponse(apiResponse)
            return apiResponse
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Login failed. Please check your credentials."
            setErrors(message)
            return { success: false, message }
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        setUser(null)
        navigate("/auth", { replace: true })
        try {
            setLoading(true)
            await logoutApi()
        } catch (err) {
            console.error("Error during logout:", err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <authContext.Provider
            value={{
                signUp,
                login,
                logout,
                loading,
                user,
                errors,
            }}
        >
            {children}
        </authContext.Provider>
    )
}