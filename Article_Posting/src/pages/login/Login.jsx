import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Navbar from "../../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "../../components/TokenExpires";
import { FaEye } from "react-icons/fa";
import { GoEyeClosed } from "react-icons/go";
import im1 from "../../assets/images/login.jpg";
import im2 from "../../assets/images/home.jpg";
import im3 from "../../assets/images/signup.jpg";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${frontendUrl}/api/users/login`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const resData = response.data;
      toast.success(resData.message || "Login successful!");

      if (resData.message === "Login successful" || resData.token) {
        localStorage.setItem("token", resData.token);
        localStorage.setItem("user", JSON.stringify(resData.user));

        const redirectPath =
          resData.user?.role === "admin" ? "/admin/articles" : "/";
        setTimeout(() => {
          navigate(redirectPath);
        }, 500);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${im3})` }}
    >
      {" "}
      <ToastContainer position="top-center" />
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              {...register("email")}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <GoEyeClosed /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:text-blue-700">
              Sign Up
            </a>
          </p>
        </div>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't remember your password?{" "}
            <a
              href="/forgot-password"
              className="text-blue-500 hover:text-blue-700"
            >
              Forgot Password
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
