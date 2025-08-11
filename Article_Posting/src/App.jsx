import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./protectedRoutes/protectedRoutes";

import Home from "./pages/home/Home";
import Signup from "./pages/signup/signup";
import Login from "./pages/login/login";
import Admin_home from "./pages/admin-home/Admin_home";
import Password_set from "./pages/password-set-email/Password_set";
import Profile from "./pages/profile/profile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Forgot_password from "./pages/forgot-password/Forgot_password";
import Reset_password from "./pages/forgot-password/Reset_password";
import CreateArticle from "./pages/articles/CreateArticle";
import DraftArticle from "./pages/articles/DraftArticle";
import PostedArticle from "./pages/articles/PostedArticle";
import EditArticle from "./pages/articles/EditArticle";
import AdminAllUsers from "./pages/admin-home/AdminAllUsers";
import EmpNavbar from "./components/EmptyNavbar";
import Articles from "./pages/articles/Articles";

function Layout() {
  const location = useLocation();

  const noNavbarRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/set-password",
  ];
  const isNoNavbarRoute = noNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {isNoNavbarRoute ? /*<EmpNavbar />*/ "" : <Navbar />}
      <div className="flex-grow mt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/set-password" element={<Password_set />} />
          <Route path="/forgot-password" element={<Forgot_password />} />
          <Route path="/reset-password" element={<Reset_password />} />

          {/* Protected Routes */}
          <Route
            path="/admin/articles"
            element={
              <ProtectedRoute>
                <Admin_home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-article"
            element={
              <ProtectedRoute>
                <CreateArticle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/article/:id"
            element={
              <ProtectedRoute>
                <Articles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/draft-article"
            element={
              <ProtectedRoute>
                <DraftArticle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posted-article"
            element={
              <ProtectedRoute>
                <PostedArticle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-article/:id"
            element={
              <ProtectedRoute>
                <EditArticle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminAllUsers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {isNoNavbarRoute ? /*<EmpNavbar />*/ "" : <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
