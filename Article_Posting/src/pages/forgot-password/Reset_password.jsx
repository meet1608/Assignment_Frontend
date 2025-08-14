import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../components/TokenExpires";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye } from "react-icons/fa";
import { GoEyeClosed } from "react-icons/go";

const schema = yup.object().shape({
  password: yup
    .string()
    .required("New Password is required")
    .min(6, "Minimum 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const Reset_password = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${frontendUrl}/api/users/reset-password/${token}`,
        {
          password: data.password,
          confirmPassword: data.confirmPassword,
        }
      );
      toast.success(res.data.message || "Password reset successfully");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
      console.error("Reset Password Error:", err);
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" />
      <h1 className="text-3xl font-bold text-center mt-8">Reset Password</h1>
      <form
        className="max-w-md mx-auto mt-8"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Password field */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`w-full p-2 border rounded ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              aria-invalid={errors.password ? "true" : "false"}
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
            <p className="text-red-500 text-xs italic" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password field */}
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className={`w-full p-2 border rounded ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <GoEyeClosed /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs italic" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default Reset_password;
