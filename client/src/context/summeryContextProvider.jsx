import { useState, useEffect, useContext, useRef } from "react"

import { SummeryContext } from "./summeryContext.js"
import { getSummaryApi, askAiApi } from "../api/summery.api.js"
import { authContext } from "./authContext.js"

const SummeryContextProvider = ({ children }) => {
    const [summery, setSummary] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { user } = useContext(authContext)
    const requestIdRef = useRef(0)

    // Clear state when user logs out
    useEffect(() => {
        if (!user) {
            requestIdRef.current += 1
            setSummary(null)
            setError("")
            setLoading(false)
        }
    }, [user])

    const clearSummary = () => {
        requestIdRef.current += 1
        setSummary(null)
        setError("")
        setLoading(false)
    }

    const fetchSummary = async (inputType, value) => {
        if (!user) {
            setError("Please log in to create a summary.")
            return
        }

        const requestId = ++requestIdRef.current
        setLoading(true)
        setError("")
        setSummary(null)

        try {
            const formData = new FormData()

            if (inputType === "text") formData.append("text", value)
            else if (inputType === "pdf") formData.append("file", value)
            else if (inputType === "url") formData.append("url", value)
            else if (inputType === "video") formData.append("file", value)

            const res = await getSummaryApi(formData)
            if (requestId === requestIdRef.current) setSummary(res.data)
        } catch (err) {
            console.error("Error while fetching summary:", err)
            if (requestId === requestIdRef.current) {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to generate summary. Please try again."
                )
            }
        } finally {
            if (requestId === requestIdRef.current) setLoading(false)
        }
    }

    const askAI = async (contentId, userQuery) => {
        try {
            const res = await askAiApi(contentId, userQuery)
            return res
        } catch (err) {
            console.error("Error while asking AI:", err)
            throw err
        }
    }

    return (
        <SummeryContext.Provider
            value={{
                summery,
                setSummary,
                clearSummary,
                fetchSummary,
                loading,
                error,
                askAI,
            }}
        >
            {children}
        </SummeryContext.Provider>
    )
}

export default SummeryContextProvider