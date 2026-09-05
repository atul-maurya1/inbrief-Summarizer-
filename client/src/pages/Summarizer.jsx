import ProfilePic from "../components/ProfilePic";
import { MdOutlineContentPaste } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import { MdMessage } from "react-icons/md";
import { MdAutoAwesome, MdInfoOutline } from "react-icons/md";
import { jsPDF } from "jspdf";

import { useState } from "react";

import TextArea from "../components/TextArea";
import InputPDF from "../components/InputPDF";
import InputLink from "../components/InputLink";
import InputYTLink from "../components/InputYTLink";
import InputVideo from "../components/InputVideo";
import AskAI from "../components/AksAI";

import { useContext } from "react"

import { SummeryContext } from "../context/summeryContext"


const Summarizer = () => {
	const [inputText, setInputText] = useState("Text");
	const [isChatOpen, setChatOpen] = useState(false);
	const { summery, loading, error } = useContext(SummeryContext)
	const [copied, setCopied] = useState(false)

	//	console.log("error " , error)

	
	function copyToClipboard() {
		if (summery) {
			let contentToCopy = "";
			if (typeof summery === "object") {
				// Title and main summary
				contentToCopy += (summery.title ? summery.title + "\n\n" : "") + (summery.summary ? summery.summary + "\n\n" : "");

				// Key Points
				if (Array.isArray(summery.keyPoints) && summery.keyPoints.length > 0) {
					contentToCopy += "Key Points:\n" + summery.keyPoints.map((kp, i) => `${i + 1}. ${kp}`).join("\n") + "\n\n";
				}

				// Keywords
				if (Array.isArray(summery.keywords) && summery.keywords.length > 0) {
					contentToCopy += "Keywords: " + summery.keywords.join(", ") + "\n";
				}
			} else {
				contentToCopy = String(summery);
			}
			navigator.clipboard.writeText(contentToCopy);
			setCopied(true)
			setTimeout(() => {
				setCopied(false)
			}, 2000)
			alert("Copied to clipboard")
		} else {
			alert("No content to copy")
		}
	}

	function handleDownloadPdf() {
		const doc = new jsPDF({
			orientation: "portrait",
			unit: "pt",
			format: "a4",
		});
		
		// PAGE SETTINGS
		const pageWidth = doc.internal.pageSize.getWidth();
		const pageHeight = doc.internal.pageSize.getHeight();
		const marginLeft = 55;
		const marginRight = 55;
		const marginTop = 60;
		const marginBottom = 60;
		const contentWidth = pageWidth - marginLeft - marginRight;
		let y = marginTop;
		const bodyFontSize = 12;
		const bodyLineHeight = 22;

		function newPage() {
			doc.addPage();
			y = marginTop;
		}

		function checkSpace(height) {
			if (y + height > pageHeight - marginBottom) {
				newPage();
			}
		}

		function addTitle(text) {
			if (!text) return;
			doc.setFont("helvetica", "bold");
			doc.setFontSize(20);
			doc.setCharSpace(0);

			const lines = doc.splitTextToSize(String(text), contentWidth);
			const totalHeight = lines.length * 32;

			checkSpace(totalHeight);

			lines.forEach(line => {
				doc.text(line, marginLeft, y, { align: "left" });
				y += 32;
			});
			y += 10;
		}

		function addHeading(text) {
			checkSpace(32);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(16);
			doc.setCharSpace(0);

			doc.text(text, marginLeft, y, { align: "left" });
			y += 28;
		}

		function addParagraph(text) {
			if (!text) return;

			doc.setFont("helvetica", "normal");
			doc.setFontSize(bodyFontSize);
			doc.setCharSpace(0);

			const lines = doc.splitTextToSize(String(text), contentWidth);

			lines.forEach((line, idx) => {
				checkSpace(bodyLineHeight);
				doc.text(line, marginLeft, y, { align: "left" });
				y += bodyLineHeight;
			});

			y += 6; // Slight gap after paragraph
		}

		function addPoint(text, index) {
			if (!text) return;
			// Numbered bullet point formatting
			const number = `${index + 1}. `;
			const numberWidth = doc.getTextWidth(number);

			doc.setFont("helvetica", "bold");
			doc.setFontSize(bodyFontSize);
			doc.setCharSpace(0);

			const pointWidth = contentWidth - numberWidth;
			const lines = doc.splitTextToSize(String(text), pointWidth);

			checkSpace(bodyLineHeight);

			// First line with number in bold
			doc.text(number, marginLeft, y, { align: "left" });
			doc.setFont("helvetica", "normal");
			doc.text(lines[0], marginLeft + numberWidth, y, { align: "left" });

			y += bodyLineHeight;

			// Remaining lines aligned under the text, not the number
			for (let i = 1; i < lines.length; i++) {
				checkSpace(bodyLineHeight);
				doc.text(lines[i], marginLeft + numberWidth, y, { align: "left" });
				y += bodyLineHeight;
			}

			y += 4; // Slight gap between points
		}

		if (summery && typeof summery === "object") {
			// TITLE
			if (summery.title) {
				addTitle(summery.title);
			}

			// SUMMARY
			if (summery.summary) {
				addHeading("Summary");
				addParagraph(summery.summary);
			}

			// KEY POINTS
			if (Array.isArray(summery.keyPoints) && summery.keyPoints.length > 0) {
				addHeading("Key Points");
				summery.keyPoints.forEach((point, index) => {
					addPoint(point, index);
				});
			}

			// KEYWORDS
			if (Array.isArray(summery.keywords) && summery.keywords.length > 0) {
				addHeading("Keywords");
				addParagraph(summery.keywords.join(", "));
			}
		}

		// PAGE NUMBERS
		const totalPages = doc.internal.getNumberOfPages();
		for (let i = 1; i <= totalPages; i++) {
			doc.setPage(i);
			doc.setFont("helvetica", "normal");
			doc.setFontSize(9);
			doc.setCharSpace(0);
			doc.text(
				`Page ${i} of ${totalPages}`,
				pageWidth - marginRight,
				pageHeight - 30,
				{ align: "right" }
			);
		}

		doc.save(`${summery?.title} - summary.pdf`);
	

	}

	return (
		<>
			<div>
				<div className=" hidden p-5 bg-white border-b-2 border-b-gray-200 lg:flex justify-between items-center px-5 ">
					<h1 className="text-xl text-gray-700 font-medium">
						Summarizer Content in a Minutes
					</h1>
					<ProfilePic />
				</div>

				<div className="w-full min-h-[700px] flex flex-col lg:flex-row gap-2">
					<div
						id="input"
						className="w-full lg:w-1/2 rounded-2xl border border-slate-200 bg-white 
                        shadow-sm overflow-hidden"
					>
						<div className="px-6 py-5">
							<div className="flex items-center gap-3">
								<div
									className="w-10 h-10 rounded-xl bg-blue-50
                                    flex items-center justify-center"
								>
									<MdOutlineContentPaste
										size={22}
										className="text-blue-600 dark:text-blue-400"
									/>
								</div>

								<div>
									<h1 className="text-md font-semibold text-gray-700">
										Add your content
									</h1>
									<p className="text-sm text-gray-600">
										Choose an input type and add your content
									</p>
								</div>
							</div>
						</div>

						{/* Input Area */}
						<div className="py-5 px-2">
							<div className="flex flex-col sm:flex-row gap-3 w-full md:flex-wrap">
								<button
									onClick={() => setInputText("Text")}
									className={`w-full sm:flex-1 flex items-center justify-center
                                     px-4 py-3 bg-white border rounded-lg gap-2 hover:border-blue-600 cursor-pointer
                                     ${inputText === "Text"
											? "border-blue-500 bg-blue-50"
											: "bg-white border-slate-200"
										}
                                     `}
								>
									<MdOutlineContentPaste size={22} color="blue" />
									<span className="text-sm font-medium">Text</span>
								</button>

								<button
									onClick={() => setInputText("PDF")}
									className={`w-full sm:flex-1 flex items-center justify-center
                                     px-4 py-3 bg-white border rounded-lg gap-2 hover:border-blue-600 cursor-pointer
                                     ${inputText === "PDF"
											? "border-blue-500 bg-blue-50"
											: "bg-white border-slate-200"
										}
                                     `}
								>
									<FaFilePdf size={22} color="green" />
									<span className="text-sm font-medium">PDF</span>
								</button>

								<button
									onClick={() => { setInputText("Link"), summery("") }}
									className={`w-full sm:flex-1 flex items-center justify-center
                                     px-4 py-3 bg-white border rounded-lg gap-2 hover:border-blue-600 cursor-pointer
                                     ${inputText === "Link"
											? "border-blue-500 bg-blue-50"
											: "bg-white border-slate-200"
										}
                                     `}
								>
									<IoIosLink size={22} color="red" />
									<span className="text-sm font-medium">Link</span>
								</button>

								<button
									onClick={() => setInputText("Video")}
									className={`w-full sm:flex-1 flex items-center justify-center
                                     px-4 py-3 bg-white border rounded-lg gap-2 hover:border-blue-600 cursor-pointer
                                     ${inputText === "Video"
											? "border-blue-500 bg-blue-50"
											: "bg-white border-slate-200"
										}
                                     `}
								>
									<FaVideo size={22} color="blue" />
									<span className="text-sm font-medium">Video</span>
								</button>

								<button
									onClick={() => setInputText("Youtube")}
									className={`w-full sm:flex-1 flex items-center justify-center
                                     px-4 py-3 bg-white border rounded-lg gap-2 hover:border-blue-600 cursor-pointer
                                     ${inputText === "Youtube"
											? "border-blue-500 bg-blue-50"
											: "bg-white border-slate-200"
										}
                                     `}
								>
									<FaYoutube size={22} color={"red"} />
									<span className="text-sm font-medium">Youtube</span>
								</button>
							</div>

							{/* Text Input */}
							{inputText === "Text" && <TextArea />}
							{inputText === "PDF" && <InputPDF />}
							{inputText === "Link" && <InputLink />}
							{inputText === "Youtube" && <InputYTLink />}
							{inputText === "Video" && <InputVideo />}
						</div>
					</div>

					<div
						id="output"
						className="w-full min-h-[700px] lg:w-1/2 rounded-2xl border border-slate-200
                        bg-white
                        shadow-sm overflow-hidden "
					>
						<div className="bg-white h-20 w-full flex justify-between items-center p-5 border-b border-gray-200">
							<p className="text-xl text-gray-700 font-semibold">Summery</p>
							<div className="flex gap-2">
								<button
									onClick={() => copyToClipboard()}
									className={`px-3 py-1 border-2 rounded-sm flex items-center gap-1 border-gray-200 text-gray-600 ${summery ? "" : " opacity-50 cursor-not-allowed"}`} disabled={!summery} >

									<FaRegCopy /> Copy

								</button>
								<button
								     onClick={handleDownloadPdf}
								    className={`px-3 py-1 border-2 rounded-sm flex items-center gap-1 border-gray-200 text-gray-600${summery ? "" : " opacity-50 cursor-not-allowed"}`}
									disabled={!summery} >
									<MdOutlineFileDownload /> Download
								</button>
							</div>
						</div>
						<div className="h-[500px] p-5 overflow-y-auto border-b-2 border-gray-200">
							{loading ? (
								<div className="h-full flex flex-col items-center justify-center gap-3 text-blue-600">
									<div className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
									<p className="text-sm font-medium">Creating your summary...</p>
								</div>
							) : summery ? (
								<div className="space-y-3">
									<div className="flex items-center gap-2 mb-4 text-blue-700">
										<MdAutoAwesome size={20} />
										<h2 className="font-semibold">
											{typeof summery === "object" ? summery.title || "AI-generated summary" : "AI-generated summary"}
										</h2>
									</div>
									<div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-md text-gray-700 leading-7 whitespace-pre-wrap">
										{typeof summery === "object" ? summery.summary : summery}
									</div>
									{typeof summery === "object" && summery.keyPoints && (
										<div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-gray-700">
											<h3 className="font-semibold mb-2">Key points</h3>
											{Array.isArray(summery.keyPoints) ? (
												<ul className="list-disc pl-5 space-y-1">
													{summery.keyPoints.map((point, index) => <li key={index}>{point}</li>)}
												</ul>
											) : <p className="whitespace-pre-wrap">{summery.keyPoints}</p>}
										</div>
									)}
									{typeof summery === "object" && summery.keywords && (
										<div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-gray-700">
											<h3 className="font-semibold mb-2">Keywords</h3>
											<div className="flex flex-wrap gap-2">
												{(Array.isArray(summery.keywords) ? summery.keywords : [summery.keywords]).map((keyword, index) => (
													<span key={index} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">{keyword}</span>
												))}
											</div>
										</div>
									)}
								</div>
							) : (
								<div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
									<div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
										<MdInfoOutline size={28} />
									</div>
									<p className="font-medium text-gray-700">Your summary appears here</p>
									<p className="text-sm mt-1">Add content on the left to get started.</p>
								</div>
							)}
						</div>

						<div className="px-2 py-4">
							<div
								className="w-full rounded-xl border border-blue-200
                                bg-gradient-to-r from-blue-50 to-indigo-50
                                p-2 sm:p-5"
							>
								<div
									className="flex flex-col sm:flex-row
                                        items-start sm:items-center
                                        justify-between gap-4"
								>
									<div className="flex items-center gap-3">
										<div
											className="w-10 h-10 shrink-0
                                            flex items-center justify-center
                                            rounded-lg bg-blue-600 text-white"
										>
											<MdMessage size={20} />
										</div>

										<div>
											<p className="text-sm sm:text-base font-semibold text-gray-800">
												Ask AI anything about your content
											</p>

											<p className="text-xs sm:text-sm text-gray-500 mt-0.5">
												Get answers, explanations, and insights instantly.
											</p>
										</div>
									</div>

									<button
										onClick={() => setChatOpen(true)}
										className="w-full sm:w-auto
                                                px-4 py-2.5
                                                rounded-lg
                                                bg-blue-600 hover:bg-blue-700
                                                text-white text-sm font-medium
                                                flex items-center justify-center gap-2
                                                transition duration-200
                                                shadow-sm"
									>
										<MdMessage size={18} />
										Open AI Chat
									</button>
								</div>
							</div>
						</div>
					</div>

					{isChatOpen && <AskAI setChatOpen={setChatOpen} />}
				</div>
			</div>
		</>
	);
};
export default Summarizer;
