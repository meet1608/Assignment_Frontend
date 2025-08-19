import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";

const LayoutWithNavbar = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} setUser={setUser} /> 
      <div className="flex-grow mt-16">
        <Outlet context={{ user, setUser }} />
      </div>
      <Footer />
    </div>
  );
};

export default LayoutWithNavbar;
