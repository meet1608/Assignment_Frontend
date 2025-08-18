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
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Password_set = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
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
      const res = await axios.post(
        `${frontendUrl}/api/users/set-password/${token}`,
        {
          password: data.password,
        }
      );
      toast.success(res.data.message || "Password set successfully");
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set password");
      console.error("Error setting password:", err);
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" />
      <h1 className="text-3xl font-bold text-center mt-8">Set Password</h1>
      <form
        className="max-w-md mx-auto mt-8"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          {/* Wrap the password input + button together */}
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? "border-red-500" : ""
              }`}
              placeholder="Enter your password"
              aria-invalid={errors.password ? "true" : "false"}
            />

            {/* Eye toggle button inside input */}
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

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Password_set;
