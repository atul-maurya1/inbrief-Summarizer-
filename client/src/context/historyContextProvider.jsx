import {historyContext} from './historyContext.js'
import {useState, useEffect, useContext, useRef} from "react"
import {getHistoryListApi, getHistoryContentApi} from '../api/history.api.js'
import {authContext} from '../context/authContext.js'
import {SummeryContext} from './summeryContext.js'

export const HistoryContextProvider = ({children}) => {

    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const [historyContent, setHistoryContent] = useState()
    const { user } = useContext(authContext)
    const { setSummary } = useContext(SummeryContext)
    const historyRequestRef = useRef(0)
    const contentRequestRef = useRef(0)

    const historyList = async () => {
            if (!user) {
                setHistory([])
                return
            }

            const requestId = ++historyRequestRef.current
            setLoading(true)
            try{
                const res = await getHistoryListApi()
                if (requestId === historyRequestRef.current) setHistory(res.data)

            }catch(err){
                if (requestId === historyRequestRef.current) {
                    setHistory([])
                    console.log("error fetching history", err)
                }
           }finally{
                if (requestId === historyRequestRef.current) setLoading(false)
            }
         }

        const clearHistoryContent = () => {
            contentRequestRef.current += 1
            setHistoryContent(null)
        }

        useEffect(() => {
            historyRequestRef.current += 1
            contentRequestRef.current += 1
            if(user){
               historyList()
            }else{
                setHistory([])
                setHistoryContent(null)
                setSummary(null)
                setLoading(false)
            }
        },[user])

        const gethistoryContent = async ({summary, _id}) => {
            if (!user) return
            const requestId = ++contentRequestRef.current
            try{
              setLoading(true)
             const res = await getHistoryContentApi(summary, _id)
             if (requestId === contentRequestRef.current) {
                 setHistoryContent(res.data)
                 setSummary(res.data.summary)
             }
            }catch(err){
             if (requestId === contentRequestRef.current) console.log("error fetching history content", err)
            }finally{
              if (requestId === contentRequestRef.current) setLoading(false)
            }
            

            
            
        }
    

    return(
        <historyContext.Provider value={{
            history,
            loading,
            historyList,
            setHistory,
            gethistoryContent,
            clearHistoryContent,
            setHistoryContent,
            historyContent
        }} >
            {children}
        </historyContext.Provider>
    )
}