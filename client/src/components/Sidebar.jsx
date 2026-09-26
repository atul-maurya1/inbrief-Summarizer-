import { CgTranscript } from "react-icons/cg";
import { AiOutlineWechatWork } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "../context/authContext";
import logo from "../assets/logo.png";
import ProfilePic from "./ProfilePic";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { historyContext } from "../context/historyContext";
import { FaFilePdf } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { FaLink } from "react-icons/fa6";
import { SummeryContext } from "../context/summeryContext";
import { IoIosLink } from "react-icons/io";

const SideBar = ({ onClose }) => {
	const { history, gethistoryContent, clearHistoryContent } = useContext(historyContext);
	const { user, logout } = useContext(authContext);
	const navigate = useNavigate();
    

	const handleHistoryClick = (historyItem) => {
		gethistoryContent(historyItem);
		navigate("/summarizer");
		onClose?.();
	};

	const { clearSummary } = useContext(SummeryContext);

	const handleOnClick = () => {
		clearSummary();
		clearHistoryContent();
		navigate("/summarizer");
		onClose?.();
	};

	return (
		<div className="workspace-sidebar flex h-screen w-64 flex-col border-r border-slate-200 bg-white p-4 text-slate-200">
			{/* Close button for mobile */}
			<div className="flex justify-between items-center mb-2 lg:hidden">
				<div className="w-30 flex py-2">
					<img src={logo} alt="InBrief logo" />
				</div>
				<button
					onClick={onClose}
					className="text-slate-600 transition hover:text-blue-700"
				>
					<IoClose size={24} />
				</button>
			</div>

			{/* Logo for desktop */}
			<div className="hidden lg:flex w-30 py-2">
				<img src={logo} alt="InBrief logo" />
			</div>

			<div className="flex flex-1 flex-col gap-4">
				{user && (
					<div id="new chat">
						<button
							onClick={handleOnClick}
							className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
						>
							+ New content
						</button>
					</div>
				)}

				<div id="tools" className="py-2">
					<h2 className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
						Tools
					</h2>
					<div className="flex flex-col gap-2">
						<NavLink
							to="summarizer"
							onClick={onClose}
							className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
						>
							<CgTranscript size={20} /> <span>Summarizer</span>
						</NavLink>

						<NavLink
							to="ai-chat"
							onClick={onClose}
							className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
						>
							<AiOutlineWechatWork size={25} /> <span>AI Chat</span>
						</NavLink>
					</div>
				</div>

				{user && (
					<div id="history" className="flex-1 border-t border-slate-200 p-3">
						<h2 className="mb-3 pt-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
							History
						</h2>
						<ul className="space-y-1.5 text-sm text-slate-600">
							{history.length === 0 ? (
								<li className="rounded-lg border border-dashed border-slate-200 px-1 py-5 text-center text-xs leading-relaxed text-slate-400">
									Your saved summaries will appear here.
								</li>
							) : (
								history.map((hs) => (
									<li key={hs._id}>
										<button
											type="button"
											onClick={() => handleHistoryClick(hs)}
											className="group flex w-full items-center gap-3 rounded-lg  py-2 text-left transition hover:bg-blue-50"
										>
											{/* Left indicator */}
											<span className="shrink-0 rounded-full bg-slate-300 transition group-hover:bg-blue-500" />

											{/* Content type icon */}
											{hs.contentType === "pdf" ? (
												<FaFilePdf
													size={18}
													className="shrink-0 text-red-500"
												/>
											) : hs.contentType === "text" ? (
												<IoDocumentText
													size={18}
													className="shrink-0 text-slate-500"
												/>
											) : hs.contentType === "website" ||
											  hs.contentType === "url" ? (
												<IoIosLink
													size={18}
													className="shrink-0 text-blue-500"
												/>
											) : (
												<IoDocumentText
													size={18}
													className="shrink-0 text-slate-400"
												/>
											)}

											{/* Title */}
											<span className="truncate font-medium text-slate-600 group-hover:text-blue-700">
												{hs.title || hs.summary || "Untitled summary"}
											</span>
										</button>
									</li>
								))
							)}
						</ul>
					</div>
				)}

				{user === null ? (
					<div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
						<h3 className="text-sm font-bold text-slate-800">
							Get more from InBrief
						</h3>
						<p className="mt-1 text-xs leading-relaxed text-slate-500">
							Sign in to save your history and unlock a more personalized
							experience.
						</p>
						<div className="mt-4 flex flex-col gap-2">
							<button
								onClick={() => navigate("/login")}
								className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
							>
								Log in
							</button>
							<button
								onClick={() => navigate("/signup")}
								className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
							>
								Create an account
							</button>
						</div>
					</div>
				) : (
					<div>
						<div
							id="pro"
							className="flex cursor-pointer items-center gap-3 mb-5 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-100"
						>
							<BsStars size={20} />{" "}
							<div className="flex items-center justify-between gap-3">
								{" "}
								Upgrade to Pro <IoIosArrowForward />
							</div>
						</div>

						<div
							id="profile"
							className="mt-auto flex items-center gap-3 border-t border-slate-200 p-3 pt-4"
						>
							<ProfilePic />
							<div className="min-w-0 flex-1">
								<p className="truncate text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
									{user ? `${user?.data?.userType} PLAN` : ""}
								</p>
							</div>
							<button
								onClick={() => logout()}
								type="button"
								aria-label="Log out"
								className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
							>
								<MdLogout size={18} />
								<span className="text-[10px] font-medium">Log out</span>
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SideBar;
