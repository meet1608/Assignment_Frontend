// LayoutWithNavbar.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const LayoutWithNavbar = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
        <div className="flex-grow mt-16">
    <Outlet />
    </div>
    <Footer />
  </div>
);

export default LayoutWithNavbar;
