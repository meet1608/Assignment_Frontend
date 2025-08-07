import { useState } from "react";
import { MdViewSidebar } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [showSidebar, setShowSidebar] = useState(false);
const navigate = useNavigate();
  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar - Visible on sm and up */}
<div className="hidden sm:flex sm:flex-col sm:w-64 bg-gray-800 text-white p-4">
        <div className="flex items-center gap-2 text-xl font-bold mb-8">
          <MdViewSidebar size={24} />
          <span>Admin Panel</span>
        </div>
        <ul className="space-y-4">
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() =>navigate('/admin/articles')}>All Articles</li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={()=> navigate('/admin/users')}>All Users</li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Settings</li>
        </ul>
      </div>

      {/* Mobile Toggle Button */}
      <button
        className="sm:hidden fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <MdViewSidebar size={24} />
      </button>

      {/* Slide-Up Mobile Sidebar */}
      {showSidebar && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-40 rounded-t-xl animate-slide-up">
          <div className="flex items-center justify-between text-xl font-bold mb-4 cursor-pointer">
            <span>Admin Panel</span>
            <button onClick={() => setShowSidebar(false)}>✖️</button>
          </div>
          <ul className="space-y-4">
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={()=>{setShowSidebar(false)
              navigate("/admin/articles");
            }}>All Articles</li>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={()=>{
              setShowSidebar(false)
              navigate("/admin/users");
            }}>All Users</li>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Settings</li>
          </ul>
        </div>
      )}


      
    </div>
  );
}
