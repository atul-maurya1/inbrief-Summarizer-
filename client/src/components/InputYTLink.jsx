import { FaYoutube } from "react-icons/fa";

const InputYTLink = () => {
	return (
		<div className="w-full py-10">
			<div
				className="w-full p-6 sm:p-8
				   border border-dashed border-blue-200
				   rounded-xl bg-blue-50/40
				   hover:border-blue-400 transition"
			>
				<div
					className="w-14 h-14 mx-auto mb-4
                     flex items-center justify-center
					 rounded-xl border border-blue-100 bg-white shadow-sm"
				>
					<FaYoutube size={30} className="text-blue-700" />
				</div>

				<h3 className="text-base font-semibold text-slate-700 text-center">
					Add YouTube Video
				</h3>

				<p className="mt-1 text-sm text-slate-400 text-center">
					Paste a YouTube video link to add its content
				</p>

				{/* YouTube URL */}
				<div className="relative mt-6">
					<FaYoutube
						size={20}
						className="absolute left-3 top-1/2
					   -translate-y-1/2 text-blue-600"
					/>

					<input
						type="url"
						placeholder="https://www.youtube.com/watch?v=..."
						className="w-full h-12 pl-10 pr-4
                       border 
                       rounded-xl bg-white
                       text-sm 
                       placeholder:text-slate-400
                       outline-none
					   focus:border-blue-500
					   focus:ring-2 focus:ring-blue-500/20"
					/>
				</div>

				<div className="py-5">
					<button
						type="button"
						className="w-full mt-4 h-12
					 rounded-lg bg-blue-600
					 hover:bg-blue-700
                     text-white text-sm font-medium
                     transition"
					>
						Add YouTube Video
					</button>
				</div>

				<p className="mt-3 text-xs text-slate-400 text-center">
					Supported: YouTube video URLs
				</p>
			</div>
		</div>
	);
};

export default InputYTLink;
