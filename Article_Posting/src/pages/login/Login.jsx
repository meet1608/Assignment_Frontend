import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const handlesubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };
    fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message || "Login successful!");
        toast.success(data.message || "Login successful!");
        if (data.message === "Login successful" || data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          const redirectPath =
            data.user?.role === "admin" ? "/admin-home" : "/";

          setTimeout(() => {
            navigate(redirectPath);
          }, 500);
        }
      })
      .catch((error) => {
        setMessage("Login failed.");
        toast.error("Login failed. Please try again.");
        console.error(error);
      });
  };

  return (
    <div>
      <ToastContainer position="top-center" />

      <div>
        <h1 className="text-3xl font-bold text-center mt-8">Login</h1>
      </div>
      <form className="max-w-md mx-auto mt-8" onSubmit={handlesubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Log In
          </button>
        </div>
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
  );
};

export default Login;
