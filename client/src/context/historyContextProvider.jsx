import {historyContext} from './historyContext.js'
import {useState, useEffect} from "react"
import {getHistoryListApi} from '../api/history.api.js'

export const HistoryContextProvider = ({children}) => {

    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)

    
         const historyList = async () => {
            setLoading(true)
            try{

                const res = await getHistoryListApi()
                setHistory(res.data)

            }catch(err){

                console.log("error ", err)

            }finally{
                setLoading(false)
            }
         }
        useEffect(() => {
            historyList()
        },[])
    

    return(
        <historyContext.Provider value={{
            history,
            loading,
            historyList
        }} >
            {children}
        </historyContext.Provider>
    )
}