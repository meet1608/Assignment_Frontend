import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./protectedRoutes/protectedRoutes";
import AdminProtected from "./protectedRoutes/AdminProtected";
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
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
import Edit_User from "./pages/admin-home/Edit_User";
import LayoutWithNavbar from './components/navbarComponents/LayoutWithNavbar';
import LayoutWithoutNavbar from './components/navbarComponents/LayoutWithoutNavbar';
function App() {
  return (
    <Router>
      <Routes>

        {/* Routes without navbar */}
        <Route element={<LayoutWithoutNavbar />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<Forgot_password />} />
          <Route path="/reset-password" element={<Reset_password />} />
          <Route path="/set-password" element={<Password_set />} />
        </Route>

        {/* Routes with navbar */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/" element={<Home />} />

          {/* Protected routes inside layout with navbar */}
          <Route
            path="/admin/articles"
            element={
              <AdminProtected>
                <Admin_home />
              </AdminProtected>
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
              <AdminProtected>
                <AdminAllUsers />
              </AdminProtected>
            }
          />
          <Route
            path="/admin/edit-user/:id"
            element={
              <AdminProtected>
                <Edit_User />
              </AdminProtected>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;