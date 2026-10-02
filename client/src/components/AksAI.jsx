import { MdMessage, MdClose, MdSend } from "react-icons/md"
import { useState, useEffect, useRef, useContext } from "react"
import { SummeryContext } from "../context/summeryContext.js"

const SUGGESTED_QUESTIONS = [
    "Summarize this",
    "What are the key points?",
    "Explain simply",
    "What are the main arguments?",
]

const AskAI = ({ setChatOpen, contendID }) => {
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([])
    const [aiLoading, setAiLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const { askAI } = useContext(SummeryContext)

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, aiLoading])

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const sendMessage = async (query) => {
        const userQuery = (query || input).trim()
        if (!userQuery) return

        if (!contendID) {
            setMessages((prev) => [
                ...prev,
                { role: "system-error", content: "No content loaded. Please summarize something first before using AI chat." },
            ])
            return
        }

        setMessages((prev) => [...prev, { role: "user", content: userQuery }])
        setInput("")
        setAiLoading(true)

        try {
            const res = await askAI(contendID, userQuery)
            const botContent = res?.data ?? res ?? "I couldn't generate a response. Please try again."
            setMessages((prev) => [...prev, { role: "bot", content: botContent }])
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "bot-error",
                    content: err?.response?.data?.message || "Something went wrong. Please try again.",
                },
            ])
        } finally {
            setAiLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setChatOpen(false)}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-slate-50 shadow-2xl flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-label="AI Assistant"
            >
                {/* Header */}
                <div className="h-16 shrink-0 px-5 flex items-center justify-between border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white">
                            <MdMessage size={19} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-800">AI Assistant</h2>
                            <p className="text-xs text-gray-400">Ask anything about your content</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setChatOpen(false)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
                        aria-label="Close AI chat"
                    >
                        <MdClose size={22} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && !aiLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                                <MdMessage size={24} />
                            </div>
                            <p className="text-sm font-medium text-gray-600">AI Assistant ready</p>
                            <p className="text-xs text-gray-400">Ask a question about your content below.</p>
                        </div>
                    )}

                    {messages.map((msg, index) => {
                        if (msg.role === "user") {
                            return (
                                <div key={index} className="flex justify-end min-w-0">
                                    <div className="max-w-[80%] min-w-0 bg-blue-700 text-white px-4 py-3 rounded-2xl rounded-tr-sm break-words">
                                        <p className="text-sm leading-6 whitespace-pre-wrap break-words">{msg.content}</p>
                                    </div>
                                </div>
                            )
                        }

                        const isError = msg.role === "bot-error" || msg.role === "system-error"
                        return (
                            <div key={index} className="flex items-start gap-3 min-w-0">
                                <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <MdMessage size={16} />
                                </div>
                                <div className={`max-w-[85%] min-w-0 border px-4 py-3 rounded-2xl rounded-tl-sm break-words ${isError ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"}`}>
                                    <p className={`text-sm leading-6 whitespace-pre-wrap break-words ${isError ? "text-red-600" : "text-gray-700"}`}>
                                        {msg.content}
                                    </p>
                                </div>
                            </div>
                        )
                    })}

                    {/* Loading indicator */}
                    {aiLoading && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <MdMessage size={16} />
                            </div>
                            <div className="border border-slate-200 bg-white px-4 py-3 rounded-2xl rounded-tl-sm">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested questions */}
                <div className="px-4 pb-3 border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-400 mb-2">Try asking</p>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {SUGGESTED_QUESTIONS.map((q) => (
                            <button
                                key={q}
                                onClick={() => sendMessage(q)}
                                disabled={aiLoading}
                                className="shrink-0 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input area */}
                <div className="shrink-0 p-4 border-t border-gray-200">
                    <div className="flex items-end gap-2 border border-gray-200 rounded-xl p-2 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10">
                        <textarea
                            ref={inputRef}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            value={input}
                            rows={1}
                            placeholder="Ask anything about your content..."
                            disabled={aiLoading}
                            className="flex-1 resize-none px-2 py-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none disabled:opacity-60 max-h-32"
                            style={{ fieldSizing: "content" }}
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={aiLoading || !input.trim()}
                            className="w-10 h-10 shrink-0 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Send message"
                        >
                            <MdSend size={19} />
                        </button>
                    </div>
                    <p className="text-[11px] text-gray-400 text-center mt-2">
                        AI answers are based on your provided content.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AskAI
