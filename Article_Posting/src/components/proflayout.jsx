import React from "react";
import BackButton from "./BackButtons";
import im1 from "../assets/images/login.jpg";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0">
        <img
          src={im1}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
      </div>
      <div className="p-6 sm:pl-36 sm:pr-24 bg-gray-50  ">
        <BackButton />
        {children}
      </div>
    </div>
  );
};

export default Layout;
