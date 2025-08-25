import React from "react";
import { Link,useNavigate } from "react-router-dom";

/**
 * Displays a 404 error page with navigation options based on user role.
 * @example
 * handlePageNotFound()
 * // Redirects to "/admin/articles" if the user is an admin; otherwise, navigates to "/"
 * @returns {JSX.Element} The 404 error component rendered, with options to navigate based on user role.
 */
const PageNotFound = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const handleclick = () => {
        if(user?.role === "admin"){
            navigate("/admin/articles");
        }
        else{
            navigate("/");
        }
    }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <h1 className="text-[120px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 animate-bounce">
        404
      </h1>
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 text-center max-w-md mb-8">
        The page you’re looking for doesn’t exist or may have been moved.  
        Try checking the URL or return to the homepage.
      </p>

      <div
        onClick={handleclick}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-medium shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer"
      >
        ⬅ Back to Home
      </div>

      <div className="absolute bottom-10 text-gray-400 text-sm">
        © {new Date().getFullYear()} Article Posting. All rights reserved.
      </div>
    </div>
  );
};

export default PageNotFound;
