import { CgTranscript } from "react-icons/cg";
import { AiOutlineWechatWork } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import {NavLink} from 'react-router-dom'


import logo from '../assets/logo.png';
import ProfilePic from "./ProfilePic";

const SideBar = ({ onClose }) => {
    return (
        <div className="flex h-screen w-72 flex-col bg-white p-4 text-slate-200 border-r-2 border-gray-200">
            {/* Close button for mobile */}
            <div className="flex justify-between items-center mb-2 lg:hidden">
                <div className="w-30 flex py-2">
                    <img src={logo} alt="InBrief logo" />
                </div>
                <button 
                    onClick={onClose}
                    className="text-gray-700 hover:text-blue-600 transition"
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
                    <button className=" mt-3 w-full rounded-md bg-blue-600 px-4 py-2 text-center  text-white transition hover:bg-blue-500">
                        New Content
                    </button>
                </div>

                <div id="tools" className="py-2">
                    <h2 className="mb-3 text-md font-semibold  text-black">
                        Tools
                    </h2>
                    <div className="flex flex-col gap-2">
                       
                        <NavLink to="summarizer" onClick={onClose} className=" flex gap-3 items-center px-3 py-2 text-left text-md font-medium  text-gray-700 hover:rounded-md cursor-pointer  transition hover:bg-blue-50 hover:text-blue-700">
                            <CgTranscript size={20}/> <span>Summarizer</span>
                        </NavLink>
                        
                        <NavLink to="ai-chat" onClick={onClose} className="flex gap-3 items-center px-3 py-2 text-left text-md font-medium text-gray-700 hover:rounded-md cursor-pointer  transition hover:bg-blue-50 hover:text-blue-700">
                           <AiOutlineWechatWork size={25}/> <span>AI Chat</span>
                        </NavLink> 
                    </div>
                </div>

                <div id="history" className="flex-1  p-3 border-t border-gray-300">
                <h2 className="mb-3 text-md font-semibold  text-black pt-2" >History</h2>
                 <ul className="text-gray-800" >
                    <li>Future of AI</li>
                    <li>What is Machine Learning</li>
                 </ul>
                </div>

                <div id="pro" className=" flex items-center gap-3 rounded-md border bg-white p-4 text-sm font-medium text-blue-700 cursor-pointer hover:bg-blue-50">
                   <BsStars size={20} /> <div className="flex items-center gap-18" > Upgrade to Pro <IoIosArrowForward/></div>
                </div>

                <div id="profile" className="mt-auto flex items-center gap-3 rounded-md border-t p-3">
                   
                       <ProfilePic />
                        <p className="text-xs text-slate-400">Free Plan</p>
                   
                </div>
            </div>
        </div>
    )
}



export default SideBar