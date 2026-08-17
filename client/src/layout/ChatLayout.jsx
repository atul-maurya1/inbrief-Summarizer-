import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from '../components/Sidebar'
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import logo from '../assets/logo.png';
import ProfilePic from "../components/ProfilePic";

const ChatLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return(
        <div className="flex h-screen">
        
            <aside className="hidden lg:block w-72 shrink-0">
                <Sidebar />
            </aside>

            
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-opacity-50 lg:hidden z-40"
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
            <div className="flex flex-1 flex-col">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4">
                    <button 
                        onClick={toggleSidebar}
                        className="text-gray-700 hover:text-blue-600 transition flex items-center gap-5"
                    >
                        <GiHamburgerMenu size={24} />
                        <div className="w-20" >
                            <img src={logo} alt="InBrief logo" />
                        </div>
                    </button>
                    <ProfilePic/>
                </div>

                <main className="flex-1 overflow-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default ChatLayout