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
import im3 from "../../assets/images/signup.jpg";

const schema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

/**
 * Renders a password setting form for users to set a new password using a token.
 * The form validates input and handles submission for password setting.
 * Displays success or failure notifications based on the API response.
 * Utilizes client-side form validation and secure password visibility toggling.
 * 
 * @example
 * // Renders the password setting form and handles form submission.
 * PasswordSet()
 * 
 * @returns {JSX.Element} Returns a JSX element rendering the password set form UI.
 */
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

  /**
  * Sets the user's password and redirects to login if successful
  * @example
  * sync(data)
  * Password set successfully
  * @param {Object} data - Contains the password information.
  * @returns {void} No return value.
  **/
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${frontendUrl}/api/users/set-password/${token}`,
        {
          password: data.password,
        }
      );
      toast.success("Password set successfully");
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (err) {
      toast.error("Failed to set password");
      console.error("Error setting password:", err);
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
        <h1 className="text-3xl font-semibold text-center mt-8">Set Password</h1>
        <form
          className="max-w-md mx-auto mt-8"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Password<span className="text-red-500"> *</span>
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
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Password_set;
