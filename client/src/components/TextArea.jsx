import {useContext, useState, useEffect} from "react"
import {SummeryContext} from "../context/summeryContext"
import { PiSpinnerGapBold } from "react-icons/pi";


const TextArea = () => {
const {fetchSummery, loading} = useContext(SummeryContext)
const [text, setText] = useState("")
const [charCount, setCharCount] = useState(0)

	function handleOnClick(){
		if(text ==="") return
		fetchSummery("text", text)

   }

   useEffect(() => {
	setCharCount(text.length)
	// if(charCount > 10000){
	// 	alert("Login Required to use the full features")
	// }
   }, [text])

	return ( 
		<>
			<div className="mt-5 flex justify-between rounded-t-lg border border-blue-100 bg-blue-50 px-5 py-3 text-sm font-medium text-slate-700">
				<span className="text-gray-700">Enter or paste your text</span>{" "}
				<button onClick={() =>{text ? setText("") : ""}} className={`${text ? "hover:text-blue-400 cursor-pointer " : "opacity-50"} `}>Clear</button>
			</div>

			<textarea
			    onChange={(e) => (setText(e.target.value))}
				value={text}
				type="text"
				placeholder="Paste or type your content here..."
				className="h-[clamp(180px,42vh,380px)] w-full resize-none rounded-b-xl border 
                            border-gray-300
                            bg-white p-3 placeholder:text-slate-400
                            outline-none focus:ring-1 focus:ring-blue-500/20 transition"
			/>

			<div className="flex items-center justify-between py-4 px-2">
				<span className="text-sm text-slate-400">{charCount} Characters</span>
			</div>

			<div>
				<button
				   onClick={handleOnClick}
					className="px-5 w-full py-2.5 rounded-xl bg-blue-600 
                                    hover:bg-blue-700 text-white text-sm 
                                    font-medium transition shadow-sm"
				>
					
					{loading ? (
						<span className="flex items-center justify-center gap-2">
							Summarizing <PiSpinnerGapBold className="animate-spin" />
						</span>
					) : (
						"Summarize with AI"
					)}
				</button>
			</div>
		</>
	);
};

export default TextArea;
