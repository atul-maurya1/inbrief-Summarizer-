import ProfilePic from "../components/ProfilePic";
import { MdOutlineContentPaste, MdCheckCircle } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import { MdMessage } from "react-icons/md";
import { MdAutoAwesome, MdInfoOutline } from "react-icons/md";
import { CgTranscript } from "react-icons/cg";
import { jsPDF } from "jspdf";

import { useEffect, useState } from "react";

import TextArea from "../components/TextArea";
import HistoryContent from "../components/HistoryContent";
import InputPDF from "../components/InputPDF";
import InputLink from "../components/InputLink";
import InputYTLink from "../components/InputYTLink";
import InputVideo from "../components/InputVideo";
import AskAI from "../components/AksAI";

import { useContext } from "react";

import { SummeryContext } from "../context/summeryContext";
import { authContext } from "../context/authContext";
import { historyContext } from "../context/historyContext";


const Summarizer = () => {
	const [inputText, setInputText] = useState("Text");
	const [isChatOpen, setChatOpen] = useState(false);
	const { summery, loading, error, clearSummary, askAI } = useContext(SummeryContext);
	const { historyContent } = useContext(historyContext);
	const [copied, setCopied] = useState(false);
	const [toastMsg, setToastMsg] = useState("");
	const summaryContent = summery?.response ?? summery;

	const { user, logout } = useContext(authContext);
	const activeHistoryContent = historyContent?.summary?._id === summery?._id
		? historyContent
		: null;

	function showToast(msg) {
		setToastMsg(msg);
		setTimeout(() => setToastMsg(""), 2500);
	}

	function copyToClipboard() {
		if (!summaryContent) {
			showToast("No content to copy");
			return;
		}
		let contentToCopy = "";
		if (typeof summaryContent === "object") {
			contentToCopy += (summaryContent.title ? summaryContent.title + "\n\n" : "") +
				(summaryContent.summary ? summaryContent.summary + "\n\n" : "");
			if (Array.isArray(summaryContent.keyPoints) && summaryContent.keyPoints.length > 0) {
				contentToCopy += "Key Points:\n" + summaryContent.keyPoints.map((kp, i) => `${i + 1}. ${kp}`).join("\n") + "\n\n";
			}
			if (Array.isArray(summaryContent.keywords) && summaryContent.keywords.length > 0) {
				contentToCopy += "Keywords: " + summaryContent.keywords.join(", ") + "\n";
			}
		} else {
			contentToCopy = String(summaryContent);
		}
		navigator.clipboard.writeText(contentToCopy)
			.then(() => {
				setCopied(true);
				showToast("Copied to clipboard!");
				setTimeout(() => setCopied(false), 2000);
			})
			.catch(() => showToast("Copy failed. Please try manually."));
	}

	function handleDownloadPdf() {
		const doc = new jsPDF({
			orientation: "portrait",
			unit: "pt",
			format: "a4",
		});

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
			lines.forEach((line) => {
				checkSpace(bodyLineHeight);
				doc.text(line, marginLeft, y, { align: "left" });
				y += bodyLineHeight;
			});
			y += 6;
		}

		function addPoint(text, index) {
			if (!text) return;
			const number = `${index + 1}. `;
			const numberWidth = doc.getTextWidth(number);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(bodyFontSize);
			doc.setCharSpace(0);
			const pointWidth = contentWidth - numberWidth;
			const lines = doc.splitTextToSize(String(text), pointWidth);
			checkSpace(bodyLineHeight);
			doc.text(number, marginLeft, y, { align: "left" });
			doc.setFont("helvetica", "normal");
			doc.text(lines[0], marginLeft + numberWidth, y, { align: "left" });
			y += bodyLineHeight;
			for (let i = 1; i < lines.length; i++) {
				checkSpace(bodyLineHeight);
				doc.text(lines[i], marginLeft + numberWidth, y, { align: "left" });
				y += bodyLineHeight;
			}
			y += 4;
		}

		if (summaryContent && typeof summaryContent === "object") {
			if (summaryContent.title) addTitle(summaryContent.title);
			if (summaryContent.summary) {
				addHeading("Summary");
				addParagraph(summaryContent.summary);
			}
			if (Array.isArray(summaryContent.keyPoints) && summaryContent.keyPoints.length > 0) {
				addHeading("Key Points");
				summaryContent.keyPoints.forEach((point, index) => addPoint(point, index));
			}
			if (Array.isArray(summaryContent.keywords) && summaryContent.keywords.length > 0) {
				addHeading("Keywords");
				addParagraph(summaryContent.keywords.join(", "));
			}
			if (summaryContent.transcript) {
				addHeading("Video Transcript");
				addParagraph(summaryContent.transcript);
			}
		}

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

		doc.save(`${summaryContent?.title || "summary"} - summary.pdf`);
	}

	const [toggle, setToggle] = useState(false);

	const toggleLogout = () => {
		setToggle(!toggle);
	};

	const handleLogout = async () => {
		await logout();
	};

	return (
		<>
			{/* Toast notification */}
			{toastMsg && (
				<div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm text-white shadow-lg">
					<MdCheckCircle size={18} className="text-green-400 shrink-0" />
					{toastMsg}
				</div>
			)}

			<div className="summarizer-page min-h-full min-w-0 overflow-visible lg:h-full lg:overflow-hidden">
				{/* Top bar */}
				<div className="hidden items-center justify-between border-b border-slate-200 bg-white p-5 lg:flex">
					<h1 className="text-xl text-gray-700 font-medium">
						Summarize content in minutes
					</h1>
					<div className="relative">
						<button
							type="button"
							onClick={toggleLogout}
							aria-label="Open profile menu"
							aria-expanded={toggle}
							className="rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							<ProfilePic />
						</button>
						{toggle && (
							<div className="absolute right-0 top-14 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
								<div className="border-b border-slate-100 px-4 pb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
									Account
								</div>
								<button
									onClick={handleLogout}
									type="button"
									className="flex w-full items-center px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600"
								>
									Logout
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Main content */}
				<div className="flex min-h-0 w-full min-w-0 flex-col gap-3 overflow-visible lg:h-[calc(100%-70px)] lg:flex-row lg:gap-2 lg:overflow-hidden">
					{/* Input Panel */}
					<div
						id="input"
						className="w-full rounded-xl border border-slate-200 bg-white shadow-md lg:w-1/2 shadow-sm overflow-hidden"
					>
						<div className="px-6 py-5">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
									<MdOutlineContentPaste size={22} className="text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<h1 className="text-md font-semibold text-gray-700">Add your content</h1>
									<p className="text-sm text-gray-600">Choose an input type and add your content</p>
								</div>
							</div>
						</div>

						{/* Input type selector */}
						<div className="py-5 px-2">
							<div className="flex flex-col sm:flex-row gap-3 w-full md:flex-wrap">
								{[
									{ label: "Text", icon: <MdOutlineContentPaste size={22} className="text-blue-700" />, value: "Text" },
									{ label: "PDF", icon: <FaFilePdf size={22} className="text-blue-700" />, value: "PDF" },
									{ label: "Link", icon: <IoIosLink size={22} className="text-blue-600" />, value: "Link" },
									{ label: "Video", icon: <FaVideo size={22} className="text-blue-700" />, value: "Video" },
									{ label: "YouTube", icon: <FaYoutube size={22} className="text-blue-700" />, value: "Youtube" },
								].map(({ label, icon, value }) => (
									<button
										key={value}
										onClick={() => {
											setInputText(value);
											if (value === "Link") clearSummary();
										}}
										className={`w-full sm:flex-1 flex items-center justify-center px-4 py-3 bg-white border rounded-lg gap-2 hover:border-blue-600 cursor-pointer ${
											inputText === value ? "border-blue-500 bg-blue-50" : "bg-white border-slate-200"
										}`}
									>
										{icon}
										<span className="text-sm font-medium">{label}</span>
									</button>
								))}
							</div>

							{/* Input components */}
							{inputText === "Text" && <TextArea />}
							{inputText === "PDF" && <InputPDF />}
							{inputText === "Link" && <InputLink />}
							{inputText === "Youtube" && <InputYTLink />}
							{inputText === "Video" && <InputVideo />}
						</div>
					</div>

					{/* Output Panel */}
					<div
						id="output"
						className="flex min-h-[28rem] min-w-0 w-full flex-1 flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
					>
						{/* Output header */}
						<div className="bg-white h-20 w-full flex justify-between items-center p-5 border-b border-gray-200">
							<p className="text-xl text-gray-700 font-semibold">Summary</p>
							<div className="flex gap-2">
								<button
									onClick={copyToClipboard}
									className={`px-3 py-1 border-2 rounded-sm flex items-center gap-1 border-gray-200 text-gray-600 ${summery ? "" : "opacity-50 cursor-not-allowed"}`}
									disabled={!summery}
								>
									<FaRegCopy /> {copied ? "Copied!" : "Copy"}
								</button>
								<button
									onClick={handleDownloadPdf}
									className={`px-3 py-1 border-2 rounded-sm flex items-center gap-1 border-gray-200 text-gray-600${summery ? "" : " opacity-50 cursor-not-allowed"}`}
									disabled={!summery}
								>
									<MdOutlineFileDownload /> Download
								</button>
							</div>
						</div>

						{/* Output body */}
						<div className="min-h-[22rem] flex-1 overflow-y-auto border-b-2 border-gray-200 p-5 lg:min-h-0">
							{loading ? (
								<div className="h-full flex flex-col items-center justify-center gap-3 text-blue-600">
									<div className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
									<p className="text-sm font-medium">Creating your summary...</p>
									{inputText === "Video" && (
										<p className="text-xs text-slate-400 text-center max-w-xs">
											Transcribing video audio and generating summary. This may take a minute…
										</p>
									)}
								</div>
							) : error ? (
								<div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
									<div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
										<MdInfoOutline size={24} />
									</div>
									<p role="alert" className="text-sm text-red-600 max-w-sm">{error}</p>
								</div>
							) : activeHistoryContent ? (
								<HistoryContent historyContent={activeHistoryContent} />
							) : summery ? (
								<div className="space-y-3">
									<div className="flex items-center gap-2 mb-4 text-blue-700">
										<MdAutoAwesome size={20} />
										<h2 className="font-semibold">
											{typeof summaryContent === "object" ? summaryContent.title || "AI-generated summary" : "AI-generated summary"}
										</h2>
									</div>

									{/* Summary text */}
									{((typeof summaryContent === "object" ? summaryContent?.summary : summaryContent) || "").trim() && (
										<div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-md text-gray-700 leading-7 whitespace-pre-wrap">
											{typeof summaryContent === "object" ? summaryContent.summary : summaryContent}
										</div>
									)}

									{/* Key points */}
									{typeof summaryContent === "object" && Array.isArray(summaryContent.keyPoints) && summaryContent.keyPoints.length > 0 && (
										<div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-gray-700">
											<h3 className="font-semibold mb-2">Key points</h3>
											<ul className="list-disc pl-5 space-y-1">
												{summaryContent.keyPoints.map((point, index) => <li key={index}>{point}</li>)}
											</ul>
										</div>
									)}

									{/* Keywords */}
									{typeof summaryContent === "object" && Array.isArray(summaryContent.keywords) && summaryContent.keywords.length > 0 && (
										<div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-gray-700">
											<h3 className="font-semibold mb-2">Keywords</h3>
											<div className="flex flex-wrap gap-2">
												{summaryContent.keywords.map((keyword, index) => (
													<span key={index} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">{keyword}</span>
												))}
											</div>
										</div>
									)}

									{/* Video transcript section */}
									{typeof summaryContent === "object" && summaryContent.transcript && (
										<div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-gray-700">
											<div className="flex items-center gap-2 mb-3">
												<CgTranscript size={18} className="text-blue-600" />
												<h3 className="font-semibold">Video Transcript</h3>
											</div>
											<div className="max-h-48 overflow-y-auto">
												<p className="text-sm leading-7 whitespace-pre-wrap text-gray-600">{summaryContent.transcript}</p>
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

						{/* Ask AI banner */}
						<div className="px-2 py-4">
							<div className="w-full rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-slate-50 p-2 sm:p-5">
								<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-blue-600 text-white">
											<MdMessage size={20} />
										</div>
										<div>
											<p className="text-sm sm:text-base font-semibold text-gray-800">Ask AI anything about your content</p>
											<p className="text-xs sm:text-sm text-gray-500 mt-0.5">Get answers, explanations, and insights instantly.</p>
										</div>
									</div>
									<button
										onClick={() => setChatOpen(true)}
										className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition duration-200 shadow-sm"
									>
										<MdMessage size={18} />
										Open AI Chat
									</button>
								</div>
							</div>
						</div>
					</div>

					{isChatOpen && <AskAI setChatOpen={setChatOpen} contendID={summery?.contentId} />}
				</div>
			</div>
		</>
	);
};
export default Summarizer;
