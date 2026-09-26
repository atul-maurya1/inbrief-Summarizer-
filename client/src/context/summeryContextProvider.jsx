import {useState, useEffect, useContext, useRef} from "react"

import {SummeryContext} from './summeryContext.js'
import {getSummaryApi} from '../api/summery.api.js'
import {authContext} from './authContext.js'

const SummeryContextProvider = ({children}) => {

    const [summery, setSummary] = useState(null);
	const [loading, setLoading] = useState(false);
    const [error , setError] = useState("")
    const {user} = useContext(authContext)
    const requestIdRef = useRef(0)

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
          try{
          
             const formData = new FormData();

            if (inputType === "text") formData.append("text", value)
            if (inputType === "pdf") formData.append("file", value)
            if (inputType === "url") formData.append("url", value)
            if (inputType === "video") formData.append("file", value)

        
            const res = await getSummaryApi(formData)
            if (requestId === requestIdRef.current) setSummary(res.data)

        }catch(err){
            console.error("error while fetchSummery ", err)
            if (requestId === requestIdRef.current) {
                setError(err.response?.data?.message || err.message)
            }
        }finally{
            if (requestId === requestIdRef.current) setLoading(false)
        }

    }

    return(
        <SummeryContext.Provider value ={{ 
                summery,
                setSummary,
                clearSummary,
                fetchSummary,
                loading,
                error
                 }} >
            {children}
        </SummeryContext.Provider>
    )
}

export default SummeryContextProvider