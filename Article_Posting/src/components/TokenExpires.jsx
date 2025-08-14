import axios from "axios";
import { toast } from "react-toastify";


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_FRONTEND_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      toast.error("Session expired. Please log in again.");
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.push("/login");
        window.location.reload(); 
      }, 2000);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
