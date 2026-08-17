import logo from "../assets/logo.png";
import ProfilePic from "../components/ProfilePic";
import { BsSendFill } from "react-icons/bs";
import { LuBotMessageSquare } from "react-icons/lu";

const AIChat = () => {
	return (
		<div>
			<div className=" hidden lg:flex justify-between px-7 py-4 border-b-2 border-gray-200">
				<div className="flex justify-center items-center gap-2 ">
					<img width="90px" size={10} src={logo} alt="logo" />
					<span className="text-lg font-semibold">AI Chat</span>
				</div>
				<ProfilePic />
			</div>

			<div className="px-4 sm:px-6 lg:px-10 py-5">
				
				<div className="h-145 overflow-y-auto space-y-5 pr-2">
					{/* User Message */}
					<div className="flex justify-end">
						<div
							className="max-w-[80%] sm:max-w-[70%]
                   bg-blue-600 text-white
                   px-4 py-3
                   rounded-2xl rounded-tr-sm
                   shadow-sm"
						>
							<p className="text-sm leading-6">Hi, How are you?</p>
						</div>
					</div>

					{/* AI Message */}
					<div className="flex items-start gap-3">
						{/* AI Icon */}
						<div
							className="w-8 h-8 shrink-0
                   rounded-lg
                   bg-blue-100
                   text-blue-600
                   flex items-center justify-center"
						>
							<span className="text-sm font-semibold"> <LuBotMessageSquare/> </span>
						</div>

						{/* AI Response */}
						<div
							className="max-w-[80%] sm:max-w-[70%]
                   bg-gray-100
                   text-gray-700
                   px-4 py-3
                   rounded-2xl rounded-tl-sm"
						>
							<p className="text-sm leading-6">
								Hello, I am fine. How are you?
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="px-7">
				<div className="w-full px-4">
					<div
						className="flex items-center gap-2
                        w-full
                        p-2
                        bg-white
                        border border-gray-200
                        rounded-2xl
                        shadow-sm
                        border-gray-200
                        focus-within:ring-2
                        focus-within:ring-blue-500/10"
					>
						<button
							type="button"
							className="w-10 h-10 shrink-0
                            flex items-center justify-center
                            rounded-xl
                            text-gray-500
                            hover:bg-gray-100
                            hover:text-blue-600
                            transition"
						>
							<span className="text-3xl font-light text-center">+</span>
						</button>

						{/* Input */}
						<input
							type="text"
							placeholder="Ask anything..."
							className="flex-1
                            min-w-0
                            h-10
                            px-2
                            bg-transparent
                            text-sm text-gray-700
                            outline-none"
						/>

						{/* Send Button */}
						<button
							type="button"
							className="w-10 h-10 shrink-0
                            flex items-center justify-center
                            rounded-xl
                            bg-blue-600
                            text-white
                            hover:bg-blue-700
                            active:scale-95
                            transition"
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
