import { FaVideo } from "react-icons/fa";

const InputVideo = () => {
	return (
		<div className="w-full py-10">
			<div
				className="w-full p-6 sm:p-8
                   border-2 border-dashed border-slate-300
                   rounded-2xl bg-slate-50
                   hover:border-blue-400 transition"
			>
				<div
					className="w-14 h-14 mx-auto mb-4
                     flex items-center justify-center
                     rounded-xl bg-blue-50"
				>
					<FaVideo size={28} className="text-blue-500" />
				</div>

				<h3 className="text-base font-semibold text-slate-700 text-center">
					Upload your video
				</h3>

				<p className="mt-1 text-sm text-slate-400 text-center">
					Select a video file to add your content
				</p>

				<div className="flex justify-center" >
                    <span
					htmlFor="video-upload"
					className="mt-3 px-4 py-2 rounded-lg
                     bg-blue-600 text-white text-sm font-medium
                     hover:bg-blue-700 transition"
				>
					Choose Video
				</span>
                </div>

				
				<input
					id="video-upload"
					type="file"
					accept="video/*"
					className="hidden"
				/>

				<p className=" text-center mt-3 text-xs text-slate-400">MP4, WebM, MOV</p>
			</div>

			<div className="py-5" >
                <button
				type="button"
				className="w-full mt-4 py-3 rounded-xl
                   bg-blue-700 hover:bg-blue-600
                   text-white text-sm font-medium
                   transition"
			>
				Upload Video
			</button>
            </div>
		</div>
	);
};

export default InputVideo;
