const TextArea = () => {
	return (
		<>
			<div className="text-sm font-medium text-slate-700  bg-gray-100 mt-5 py-3 px-5 flex justify-between border border-gray-300 rounded-t-xl">
				<span className="text-gray-700">Enter or paste your text</span>{" "}
				<button className="hover:text-blue-400">Clear</button>
			</div>

			<textarea
				placeholder="Paste or type your content here..."
				className="w-full h-90 resize-none rounded-b-xl border 
                            border-gray-300
                            bg-white p-3 placeholder:text-slate-400
                            outline-none focus:ring-1 focus:ring-blue-500/20 transition"
			/>

			<div className="flex items-center justify-between py-4 px-2">
				<span className="text-xs text-slate-400">0 characters</span>
			</div>

			<div>
				<button
					className="px-5 w-full py-2.5 rounded-xl bg-blue-600 
                                    hover:bg-blue-700 text-white text-sm 
                                    font-medium transition shadow-sm"
				>
					Summarizer with AI
				</button>
			</div>
		</>
	);
};

export default TextArea;
