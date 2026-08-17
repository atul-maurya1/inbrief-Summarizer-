import { Route, Routes, Navigate } from "react-router-dom";
import Summarizer from './pages/Summarizer'
import AIChat from "./pages/AIChat";
import ChatLayout from "./layout/ChatLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatLayout />}>
        <Route index element={<Navigate to="/summarizer" replace />} />
        <Route path="summarizer" element={<Summarizer />} />
        <Route path="ai-chat" element={<AIChat />} />
      </Route>
    </Routes>
  )
}

export default App
