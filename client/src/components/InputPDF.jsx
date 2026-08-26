import { FaFilePdf } from "react-icons/fa";
import {useContext, useState} from "react"
import {SummeryContext} from "../context/summeryContext"
import { PiSpinnerGapBold } from "react-icons/pi";

const InputPDF = () => {

	 const [pdf, setPDF] = useState(null);

	const {fetchSummery, loading} = useContext(SummeryContext)
	
	 const handleSubmit =  (e) => {
		 e.preventDefault()
		 fetchSummery("", pdf)
       
	}

	return (
		<>
		<form onSubmit={handleSubmit} >
        <div className="w-full py-9">
			<label
				htmlFor="pdf-upload"
				className="flex flex-col items-center justify-center
               w-full min-h-48 px-6 py-8
               border-2 border-dashed border-slate-300
               rounded-2xl bg-slate-50
               hover:bg-slate-100 hover:border-blue-400
               cursor-pointer transition-all duration-200"
			>
				{/* Icon */}
				<div
					className="w-14 h-14 mb-4 flex items-center justify-center
                    rounded-xl bg-red-50"
				>
					<FaFilePdf size={28} className="text-red-500" />
				</div>

				{/* Text */}
				<h3 className="text-sm sm:text-base font-semibold text-slate-700">
					{pdf ? pdf.name : "Upload your PDF"}
				</h3>

				<p className="mt-1 text-xs sm:text-sm text-slate-400 text-center">
					{pdf ? "PDF Uploader Successfully": "Click to browse or drag and drop your file here"}
				</p>
 
				<span
					className="mt-3 px-4 py-2 rounded-lg
                     bg-blue-600 text-white text-sm font-medium
                     hover:bg-blue-700 transition"
				>
					Choose PDF
				</span>

				<p className="mt-3 text-xs text-slate-400">PDF files only</p>

				{/* Actual input */}
				
				<input
					id="pdf-upload"
					type="file"
					accept=".pdf,application/pdf"
					className="hidden"
					onChange={(e) => setPDF(e.target.files[0])}
				/>
				
			</label>
		</div>
        <div className="py-5" >
				<button type="submit"
					className="px-5 w-full py-2.5 rounded-xl bg-blue-600 
                             hover:bg-blue-700 text-white text-sm 
                             font-medium transition shadow-sm"
				>
					{loading ? (
						<span className="flex items-center justify-center gap-2">
							Summarizing <PiSpinnerGapBold className="animate-spin" />
						</span>
					) : (
						"Summarizer with AI"
					)}
				</button>
				
			</div>
			</form>
        </>
	);
};

export default InputPDF;
