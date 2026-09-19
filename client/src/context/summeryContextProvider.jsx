import{useState , useEffect} from "react"
import axios from "axios"

import {SummeryContext} from './summeryContext.js'
import {getSummaryApi} from '../api/summery.api.js'

const SummeryContextProvider = ({children}) => {

    const [summery, setSummary] = useState(null);
	const [loading, setLoading] = useState(false);
    const [error , setError] = useState("")

    const fetchSummary = async (inputType, value) => {
        setLoading(true)
          try{
          
             const formData = new FormData();

            if (inputType === "text") formData.append("text", value)
            if (inputType === "pdf") formData.append("file", value)
            if (inputType === "url") formData.append("url", value)
            if (inputType === "vedio") formData.append("vedio", value)

        
            const res = await getSummaryApi(formData)
            setSummary(res.data)

        }catch(err){
            console.error("error while fetchSummery ", err)
              setError(
                err.response?.data || err.message
            );
        }finally{
            setLoading(false)
        }

    }

    return(
        <SummeryContext.Provider value ={{ 
                summery,
                fetchSummary,
                loading,
                error
                 }} >
            {children}
        </SummeryContext.Provider>
    )
}

export default SummeryContextProvider