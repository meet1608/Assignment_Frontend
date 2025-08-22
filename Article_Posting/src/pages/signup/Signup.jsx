import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../../components/TokenExpires";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import im3 from "../../assets/images/signup.jpg";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("First Name is required")
    .min(2, "Too short"),
  lastName: yup
    .string()
    .trim()
    .required("Last Name is required")
    .min(2, "Too short"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email format"),
});

const Signup = () => {
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

  if (!frontendUrl) {
    console.error("VITE_FRONTEND_URL is not set in .env file");
  }
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData) => {
    try {
      const trimmedData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      };

      const response = await axios.post(
        `${frontendUrl}/api/users/create`,
        trimmedData
      );

      toast.success("Signup successful! Check your email.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      
      toast.error("Signup failed. Please try again.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${im3})` }}
    >      <ToastContainer position="top-center" />

        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-md">

      {" "}
      <h1 className="text-3xl font-semibold text-center mt-8">Signup</h1>
      <form
        className="max-w-md mx-auto mt-8"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            First Name<span className="text-red-500"> *</span>
          </label>
          <input
            id="firstName"
            {...register("firstName")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline ${
              errors.firstName ? "border-red-500" : ""
            }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs italic">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Last Name<span className="text-red-500"> *</span>
          </label>
          <input
            id="lastName"
            {...register("lastName")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline ${
              errors.lastName ? "border-red-500" : ""
            }`}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs italic">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Email<span className="text-red-500"> *</span>
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline ${
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

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </button>
        </div>
      </form>
      <div className="text-center mt-4">
        <p className="text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:text-blue-700">
            Login
          </a>
        </p>
      </div>
      </div>
    </div>
  );
};

export default Signup;
