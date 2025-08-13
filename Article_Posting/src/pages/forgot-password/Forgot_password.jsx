import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Yup schema for email validation
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

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${frontendUrl}/api/users/forgot-password`, {
        email: data.email,
      });
      toast.success(res.data.message || "Password reset link sent to your email");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to reset password";
      console.error("Forgot Password Error:", message);
      toast.error(message);
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" />
      <h1 className="text-3xl font-bold text-center mt-8">Forgot Password</h1>
      <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Forgot_password;
