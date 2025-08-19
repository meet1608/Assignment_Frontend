import React from "react";
import axios from "../../components/TokenExpires";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import im3 from "../../assets/images/signup.jpg";

const schema = yup.object().shape({
  email: yup.string().required("Email is required").email("Invalid email format"),
});

const Forgot_password = () => {
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${frontendUrl}/api/users/forgot-password`, {
        email: data.email,
      });
      toast.success(res.data.message || "Password reset link sent to your email");
      setTimeout(() => {
        navigate("/login");
      },1000);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to reset password";
      console.error("Forgot Password Error:", message);
      toast.error(message);
    }
  };

  return (
  <div
  className="min-h-screen flex items-center justify-center bg-cover bg-center"
style={{ backgroundImage: `url(${im3})` }}
>          <ToastContainer position="top-center" />

  <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h1 className="text-3xl font-semibold text-center mb-8">Forgot Password</h1>
      <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.email ? "border-red-500" : ""
            }`}
            placeholder="Enter your email"
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
        </div>
      </form>
      <div className="text-center mt-4">
        <p className="text-gray-600">
          Remembered your password?{" "}
          <a href="/login" className="text-blue-500 hover:text-blue-700">
            Login
          </a>
        </p>
      </div>
      </div>
    </div>
  );
};

export default Forgot_password;
