import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/home";
import Signup from "./pages/signup/signup";
import Login from "./pages/login/login";
import Admin_home from "./pages/admin-home/admin_home";
import Password_set from "./pages/password-set-email/Password_set";
import Profile from "./pages/profile/profile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Forgot_password from "./pages/forgot-password/Forgot_password";
import Reset_password from "./pages/forgot-password/Reset_password";
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow mt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-home" element={<Admin_home />} />
            <Route path="/set-password" element={<Password_set />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/forgot-password" element={<Forgot_password />} />
<Route path="/reset-password" element={<Reset_password />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
export default App;
