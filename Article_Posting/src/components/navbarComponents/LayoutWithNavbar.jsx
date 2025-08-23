import { Outlet } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../../theme";
import { ThemeContext } from "../ThemeContext";


const LayoutWithNavbar = () => {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <MuiThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <div className="flex flex-col min-h-screen dark:bg-gray-900">
        <Navbar user={user} setUser={setUser} />
        <div className="flex-grow mt-16">
          <Outlet context={{ user, setUser }} />
        </div>
        <Footer />
      </div>
    </MuiThemeProvider>
  );
};

export default LayoutWithNavbar;
