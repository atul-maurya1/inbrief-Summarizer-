import { Navigate, Route, Routes } from "react-router-dom";
import Summarizer from './pages/Summarizer'
import AIChat from "./pages/AIChat";
import ChatLayout from "./layout/ChatLayout";
import Auth from "./pages/Auth";
import {useContext} from 'react'
import {authContext} from './context/authContext'



function App() {

  const{ user } = useContext(authContext)

  return (
    <Routes>
      <Route path="/auth" element = <Auth /> />

      <Route element= <ChatLayout /> >
        <Route path="/summarizer" element={<Summarizer />} />
        <Route path="/ai-chat" element={<AIChat />} />
      </Route>

      //<Route path="*" element={<Navigate to={user ? "/summarizer" : "/auth"} replace />} />
    </Routes>
  )
}

export default App
