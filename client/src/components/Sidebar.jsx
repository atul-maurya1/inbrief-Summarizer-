import { CgTranscript } from "react-icons/cg";
import { AiOutlineWechatWork } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import {NavLink} from 'react-router-dom'
import {useContext} from 'react'
import {authContext} from '../context/authContext' 
import logo from '../assets/logo.png';
import ProfilePic from "./ProfilePic";

const SideBar = ({ onClose }) => {
     const{ user } = useContext(authContext)
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
                <div id="new chat">
                    <button className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                        + New content
                    </button>
                </div>

                <div id="tools" className="py-2">
                    <h2 className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        Tools
                    </h2>
                    <div className="flex flex-col gap-2">
                       
                        <NavLink to="summarizer" onClick={onClose} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700">
                            <CgTranscript size={20}/> <span>Summarizer</span>
                        </NavLink>
                        
                        <NavLink to="ai-chat" onClick={onClose} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700">
                           <AiOutlineWechatWork size={25}/> <span>AI Chat</span>
                        </NavLink> 
                    </div>
                </div>

                     <div id="history" className="flex-1 border-t border-slate-200 p-3">
                     <h2 className="mb-3 pt-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400" >History</h2>
                      <ul className="space-y-2 text-sm text-slate-600" >
                          <li className="truncate">Future of AI</li>
                          <li className="truncate">What is Machine Learning</li>
                 </ul>
                </div>

                     <div id="pro" className="flex cursor-pointer items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-100">
                         <BsStars size={20} /> <div className="flex items-center justify-between gap-3" > Upgrade to Pro <IoIosArrowForward/></div>
                </div>

                <div id="profile" className="mt-auto flex items-center gap-3 border-t border-slate-200 p-3 pt-4">
                   
                       <ProfilePic />
                        <p className="text-xs text-slate-400">{user ? (user?.data?.userType) + '  PLAN' : ""} </p>
                   
                </div>
            </div>
        </div>
    )
}



export default SideBar