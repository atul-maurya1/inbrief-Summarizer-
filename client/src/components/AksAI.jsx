import { MdMessage, MdClose, MdSend } from "react-icons/md";
import { useState, useEffect, useRef , useContext} from "react";
import {SummeryContext} from '../context/summeryContext.js'

const AskAI = ({ setChatOpen, contendID }) => {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState([]);
	const [msg, setMsg] = useState([]);
	const messagesEndRef = useRef(null);

	const { summery, askAI } = useContext(SummeryContext)
	

	const handleClick = async () => {
		if (!input.trim()) return;

         if(!contendID){
			alert("please insert content")
		 }

		const userQuery = input.trim();
		

		setMessages((prev) => [
			...prev,
			{
				role: "user",
				content: userQuery,
			},
		]);

		setInput("");
		console.log("contendID ", contendID)
		const res = await askAI(contendID, userQuery)

		console.log("bot res ", res)

			setMessages((prev) => [
				...prev,
				{
					role: "bot",
					content: res?.data
				},
			]);
		
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [messages]);

	return (
		<div className="fixed inset-0 z-50">
			<div className="absolute inset-0 bg-black/40 " />
			<div
				className="absolute right-0 top-0
                   w-full sm:w-md
                   h-full
					bg-slate-50
                   shadow-2xl
                   flex flex-col"
			>
				<div
					className="h-18 shrink-0
                     px-5
                     flex items-center justify-between
                     border-b border-gray-200"
				>
					<div className="flex items-center gap-3">
						<div
							className="w-10 h-10 rounded-xl
										bg-blue-700
                         flex items-center justify-center
                         text-white"
						>
							<MdMessage size={21} />
						</div>

						<div>
							<h2 className="text-base font-semibold text-gray-800">
								AI Assistant
							</h2>

							<p className="text-xs text-gray-400">
								Ask anything about your content
							</p>
						</div>
					</div>

					{/* Close Button */}
					<button
						onClick={() => setChatOpen(false)}
						className="w-9 h-9 rounded-lg
                       flex items-center justify-center
                       text-gray-500
                       hover:bg-gray-100
                       transition"
					>
						<MdClose size={22} />
					</button>
				</div>

				{/* Chat Messages */}
				<div className="flex-1 min-w-0 overflow-y-auto p-5 space-y-5">
					{messages.map((msg, index) =>
						msg.role === "user" ? (
						/* User Message */
						<div key={index} className="flex justify-end min-w-0">
							<div
							className="
								max-w-[80%]
								min-w-0
								bg-blue-700
								text-white
								px-4 py-3
								rounded-2xl
								rounded-tr-sm
								break-words
								overflow-wrap-anywhere
							"
							>
							<p className="text-sm leading-6 whitespace-pre-wrap break-words">
								{msg.content}
							</p>
							</div>
						</div>
						) : (
						/* Bot Message */
						<div key={index} className="flex items-start gap-3 min-w-0">
							{/* Bot Icon */}
							<div
							className="
								w-8 h-8
								shrink-0
								rounded-lg
								bg-blue-100
								text-blue-600
								flex items-center justify-center
							"
							>
							<MdMessage size={17} />
							</div>

							{/* Bot Message */}
							<div
							className="
								max-w-[85%]
								min-w-0
								border
								border-slate-200
								bg-white
								px-4 py-3
								rounded-2xl
								rounded-tl-sm
								break-words
								overflow-wrap-anywhere
							"
							>
							<p
								className="
								text-sm
								text-gray-700
								leading-6
								whitespace-pre-wrap
								break-words
								"
							>
								{msg.content}
							</p>
							</div>
						</div>
						)
					)}
					<div ref={messagesEndRef} />
					</div>

				{/* Suggested Questions */}
				<div className="px-4 pb-3">
					<p className="text-xs text-gray-400 mb-2">Try asking</p>

					<div className="flex gap-2 overflow-x-auto pb-1">
						<button
							className="shrink-0 px-3 py-2
                         border border-gray-200
                         rounded-lg
                         text-xs text-gray-600
                         hover:bg-gray-50"
						>
							Summarize this
						</button>

						<button
							className="shrink-0 px-3 py-2
                         border border-gray-200
                         rounded-lg
                         text-xs text-gray-600
                         hover:bg-gray-50"
						>
							Key points
						</button>

						<button
							className="shrink-0 px-3 py-2
                         border border-gray-200
                         rounded-lg
                         text-xs text-gray-600
                         hover:bg-gray-50"
						>
							Explain simply
						</button>
					</div>
				</div>

				{/* Input Area */}
				<div
					className="shrink-0
                     p-4
                     border-t border-gray-200"
				>
					<div
						className="flex items-end gap-2
                       border border-gray-200
                       rounded-xl
                       p-2
                       bg-white
                       focus-within:border-blue-500
                       focus-within:ring-2
                       focus-within:ring-blue-500/10"
					>
						<textarea
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleClick();
								}
							 }}
							value={input}
							rows="1"
							placeholder="Ask anything about your content..."
							className="flex-1
                         resize-none
                         px-2 py-2
                         text-sm
                         text-gray-700
                         placeholder:text-gray-400
                         outline-none"
						/>

						<button
							onClick={handleClick}
							className="w-10 h-10 shrink-0
                         rounded-lg
                         bg-blue-600
                         hover:bg-blue-700
                         text-white
                         flex items-center justify-center
                         transition"
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
	);
};

export default AskAI;
