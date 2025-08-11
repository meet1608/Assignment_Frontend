import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-black p-4 fixed w-full z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div
          className="text-white text-2xl md:text-3xl font-semibold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Article Posting
        </div>

     </div>
    </nav>
  );
};

export default Navbar;
