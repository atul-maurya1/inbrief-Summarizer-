import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from '../components/Sidebar'
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import logo from '../assets/logo.png';
import ProfilePic from "../components/ProfilePic";

const ChatLayout = () => {

    let user = null

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return(
        <div className="workspace-shell flex h-screen min-w-0 overflow-x-hidden bg-slate-50 text-slate-900">
        
            <aside className="hidden w-64 shrink-0 lg:block">
                <Sidebar />
            </aside>

            
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed top-0 left-0 z-50 h-screen w-72 transform transition-transform duration-300 lg:hidden ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </aside>

            {/* Main Content */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Mobile Header */}
                <div className="workspace-mobile-header flex items-center justify-between border-b border-slate-200 bg-white/90 p-4 backdrop-blur lg:hidden">
                    <button 
                        onClick={toggleSidebar}
                        className="flex items-center gap-5 text-slate-700 transition hover:text-blue-700"
                    >
                        <GiHamburgerMenu size={24} />
                        <div className="w-20" >
                            <img src={logo} alt="InBrief logo" />
                        </div>
                    </button>
                    {user ? <ProfilePic/> : "Login"}
                </div>

                <main className="workspace-main min-h-0 flex-1 overflow-auto bg-slate-50">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default ChatLayout