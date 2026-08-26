import{useState , useEffect} from "react"
import axios from "axios"

import {SummeryContext} from './summeryContext.js'

const SummeryContextProvider = ({children}) => {

    const [summery, setSummery] = useState(null);
	const [loading, setLoading] = useState(false);
    const [error , setError] = useState("")

    const fetchSummery = async (text = "" , pdf = null, url = "", vedio = "") => {
        setLoading(true)
          try{
          
            const formData = new FormData()

            if (text) formData.append("text", text)
            if (pdf) formData.append("file", pdf)
            if (url) formData.append("url", url)
            if (vedio) formData.append("vedio", vedio)

            const res = await axios.post('http://localhost:8000/api/v1/summarizer/summarize-content', formData)
            setSummery(res.data.data)

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
                fetchSummery,
                loading,
                error
                 }} >
            {children}
        </SummeryContext.Provider>
    )
}

export default SummeryContextProvider