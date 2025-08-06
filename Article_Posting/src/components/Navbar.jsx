import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (token && user) {
    setIsLoggedIn(true);
  } else {
    setIsLoggedIn(false);
  }
}, [localStorage.getItem("token"), localStorage.getItem("user")]);


  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleProfile = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    navigate(`/profile/${user.id}`);
  };

  const handlehome = () => {
    if(!isLoggedIn) {
      navigate("/");
      return;
    }
    navigate(`${user?.role === "admin" ? "/admin-home" : "/"}`);
  };


  return (
    <nav className="bg-black p-4 fixed w-full z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-2xl md:text-3xl font-semibold cursor-pointer" onClick={handlehome}>
          Article Posting

        </div>
        
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </button>
        </div>
        <div className="hidden md:flex space-x-6 items-center">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="text-white hover:text-gray-300"
                onClick={() => setOpenDropdown(!openDropdown)}
              >
                <CiUser className="w-7 h-7 " />
              </button>
              {openDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50 cursor-pointer">
                  <div className="py-1 block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleProfile}>Profile</div>
                  <div className="py-1 block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleProfile}>Draft Articles</div>
                  <div className="py-1 block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleLogout}>Logout</div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-white hover:text-gray-300">
              Login
            </Link>
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-2 flex flex-col space-y-2">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="text-white hover:text-gray-300"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/blog"
                className="text-white hover:text-gray-300"
                onClick={() => setOpen(false)}
              >
                Blog
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="text-left text-white hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-white hover:text-gray-300"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
