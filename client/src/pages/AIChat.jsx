import apiClient from "../api/apiClient";
import logo from "../assets/logo.png";
import ProfilePic from "../components/ProfilePic";
import { BsSendFill } from "react-icons/bs";
import { LuBotMessageSquare } from "react-icons/lu";
import { useState, useEffect, useRef } from "react";

const AIChat = () => {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef(null);

	const handleOnClick = async () => {
		if (!input.trim() || loading) return;

		const userMessage = input.trim();

		// Add user message
		setMessages((prev) => [
			...prev,
			{
				role: "user",
				content: userMessage,
			},
		]);

		// Clear input
		setInput("");
		setLoading(true);

		try {
			const res = await apiClient.post("/ai/chat-ai", {
				inputMsg: userMessage,
			});

			const botContent = res.data?.data?.content || "No response generated. Please try again.";

			setMessages((prev) => [
				...prev,
				{
					role: "bot",
					content: botContent,
				},
			]);
		} catch (err) {
			console.error("AI Chat error:", err);
			setMessages((prev) => [
				...prev,
				{
					role: "bot",
					content: err.response?.data?.message || "Failed to reach AI. Please check your connection and try again.",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	// Send message with Enter key
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleOnClick();
		}
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [messages, loading]);

	return (
		<div>
			{/* Header */}
			<div className="hidden items-center justify-between border-b border-slate-200 bg-white px-7 py-4 lg:flex">
				<div className="flex justify-center items-center gap-2">
					<img width="90px" src={logo} alt="logo" />

					<span className="text-lg font-semibold tracking-tight text-slate-900">
						AI Chat
					</span>
				</div>

				<ProfilePic />
			</div>

			{/* Chat Area */}
			<div className="px-4 py-6 sm:px-6 lg:px-10">
				<div className="h-145 overflow-y-auto space-y-5 pr-2">
					{messages.length === 0 && (
						<div className="flex min-h-56 items-center justify-center text-center">
							<h1 className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 bg-clip-text px-4 text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
								Welcome to InBrief Chat Bot
							</h1>
						</div>
					)}

					{messages.map((msg, index) => (
						<div key={index}>
							{msg.role === "user" ? (
								/* User Message */
								<div className="flex justify-end">
									<div
										className="
											max-w-[80%] sm:max-w-[70%]
											bg-blue-700 text-white
											px-4 py-3
											rounded-2xl rounded-tr-sm
											shadow-sm
										"
									>
										<p className="text-sm leading-6">
											{msg.content}
										</p>
									</div>
								</div>
							) : (
								/* Bot Message */
								<div className="flex items-start gap-3">
									<div
										className={`
											w-8 h-8 shrink-0
											rounded-lg
											bg-blue-100
											text-blue-600
											flex items-center justify-center
											transition-transform duration-300
										`}
									>
										<LuBotMessageSquare />
									</div>

									<div
										className="
											max-w-[80%] sm:max-w-[70%]
											border border-slate-200
											bg-white text-gray-700
											px-4 py-3
											rounded-2xl rounded-tl-sm
										"
									>
										<p className="text-sm leading-6 whitespace-pre-wrap">
											{msg.content}
										</p>
									</div>
								</div>
							)}
						</div>
					))}

					{/* Loading indicator */}
					{loading && (
						<div className="flex items-start gap-3">
							<div className="w-8 h-8 shrink-0 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center animate-pulse">
								<LuBotMessageSquare />
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
			</div>

			{/* Input */}
			<div className="px-7">
				<div className="w-full px-4">
					<div
						className="
							flex items-center gap-2
							w-full
							p-2
							bg-white
							border border-gray-200
							rounded-2xl
							shadow-sm
							focus-within:ring-2
							focus-within:ring-blue-500/10
						"
					>
						{/* Input */}
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							type="text"
							placeholder="Ask anything..."
							disabled={loading}
							className="
								flex-1
								min-w-0
								h-10
								px-2
								bg-transparent
								text-sm text-gray-700
								outline-none
								disabled:opacity-50
							"
						/>

						{/* Send Button */}
						<button
							onClick={handleOnClick}
							type="button"
							disabled={loading || !input.trim()}
							className="
								w-10 h-10 shrink-0
								flex items-center justify-center
								rounded-xl
								bg-blue-600
								text-white
								hover:bg-blue-700
								active:scale-95
								transition
								disabled:opacity-50
								disabled:cursor-not-allowed
							"
						>
							<BsSendFill size={15} />
						</button>
					</div>

					<p className="text-[11px] text-gray-400 text-center mt-2">
						In-Brief can make mistakes. Check important info.
					</p>
				</div>
			</div>
		</div>
	);
};

export default AIChat;
