import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CiUser } from "react-icons/ci";

const Navbar = ({ user, setUser }) => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

  const isActive = (path) =>
    location.pathname === path
      ? "bg-yellow-300 "
      : "hover:bg-yellow-300  hover:text-black";
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [localStorage.getItem("token"), localStorage.getItem("user")]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
   if(user?.role === "admin"){
    navigate("/admin/articles");
   }
  },[])

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
        setUser(null); 
    navigate("/login");
  };

  const handleProfile = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    navigate(`/profile/${user.id}`);
  };

  const handlemobileprofile = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    navigate(`/profile/${user.id}`);
    setOpen(false);
  };

  const handleArticle = () => {
    navigate("/create-article");
    setOpen(false);
  };

  const handleArticleMobile = () => {
    navigate("/create-article");
    setOpen(false);
  };

  const handleDraftArticle = () => {
    navigate("/draft-article");
    setOpen(false);
  };

  const handlehome = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (user?.role === "admin") {
      navigate("/admin/articles");
      return;
    } else if (user?.role === "user") {
      navigate("/");
      return;
    } else {
      navigate("/");
      return;
    }
  };

  return (
    <nav className="bg-black p-4 fixed w-full z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div
          className="text-white text-2xl md:text-3xl font-semibold cursor-pointer"
          onClick={handlehome}
        >
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
            <div className="relative " ref={dropdownRef}>
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setOpenDropdown(!openDropdown)}
              >
                <img
                  src={
                    user?.profileImage
                      ? `${frontendUrl}${user.profileImage}`
                      : `${frontendUrl}${user.profileImage}`
                  }
                  alt="Profile"
                  className="w-7 h-7 rounded-full object-cover"
                />
                {/* Username */}
                <span className="text-white font-medium">
                  {user?.firstName}{" "}
                  {user?.lastName}
                </span>
              </button>
              {openDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50 cursor-pointer">
                  <div
                    className="py-1 block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      handleProfile();
                      setOpenDropdown(false); // Close dropdown
                    }}
                  >
                    Profile
                  </div>

                  <div
                    className="py-1 block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      handleDraftArticle();
                      setOpenDropdown(false); // Close dropdown
                    }}
                  >
                    Draft Articles
                  </div>

                  <div
                    className="py-1 block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      handleLogout();
                      setOpenDropdown(false); // Close dropdown
                    }}
                  >
                    Logout
                  </div>
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
              <div
                className="text-white hover:text-gray-300"
                onClick={handleArticleMobile}
              >
                Add Article
              </div>
              <div
                className="text-white hover:text-gray-300"
                onClick={handlemobileprofile}
              >
                Profile
              </div>

              <Link
                to="/draft-article"
                className="text-white hover:text-gray-300"
                onClick={() => setOpen(false)}
              >
                Draft Articles
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
