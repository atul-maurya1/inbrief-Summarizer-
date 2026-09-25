import {historyContext} from './historyContext.js'
import {useState, useEffect, useContext} from "react"
import {getHistoryListApi, getHistoryContentApi} from '../api/history.api.js'
import {authContext} from '../context/authContext.js'

export const HistoryContextProvider = ({children}) => {

    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const { user } = useContext(authContext)
    
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
            if(user){
               historyList()
            }else{
                setHistory([])
            }
           
        },[user])

        const historyContent = async ({summary, _id}) => {
            try{
              setLoading(true)
              await getHistoryContentApi(summary, _id)
            }catch(err){
             console.log("error ", err)
            }finally{
              setLoading(false)
            }
            

            
            
        }
    

    return(
        <historyContext.Provider value={{
            history,
            loading,
            historyList,
            setHistory,
            historyContent
        }} >
            {children}
        </historyContext.Provider>
    )
}