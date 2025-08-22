import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_FRONTEND_URL,
});


const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/set-password",
];
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
 const currentPath = window.location.pathname;

      if (!authRoutes.includes(currentPath)) {
        toast.error("Session expired. Please log in again.");
      }

       setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (!authRoutes.includes(currentPath)) {
          window.location.href = "/login";
        }
      }, 1000);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
