import React from "react";
import BackButton from "./BackButtons";

const Layout = ({ children }) => {
  return (
    <div className="p-6 sm:pl-36 sm:pr-24 bg-gray-50 min-h-screen">
      <BackButton />
      {children}
    </div>
  );
};

export default Layout;
