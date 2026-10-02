import { Navigate, Route, Routes } from "react-router-dom"
import Summarizer from "./pages/Summarizer"
import AIChat from "./pages/AIChat"
import ChatLayout from "./layout/ChatLayout"
import Auth from "./pages/Auth"
import { useContext } from "react"
import { authContext } from "./context/authContext"

function ProtectedRoute({ children }) {
    const { user, loading } = useContext(authContext)

    if (loading) {
        return (
            <div className="flex h-dvh items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                    <p className="text-sm text-slate-500">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/auth" replace />
    }

    return children
}

function App() {
    const { user } = useContext(authContext)

    return (
        <Routes>
            {/* Public */}
            <Route
                path="/auth"
                element={user ? <Navigate to="/summarizer" replace /> : <Auth />}
            />

            {/* Protected – require auth */}
            <Route
                element={
                    <ProtectedRoute>
                        <ChatLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/summarizer" element={<Summarizer />} />
                <Route path="/ai-chat" element={<AIChat />} />
            </Route>

            {/* Catch-all */}
            <Route
                path="*"
                element={<Navigate to={user ? "/summarizer" : "/auth"} replace />}
            />
        </Routes>
    )
}

export default App
