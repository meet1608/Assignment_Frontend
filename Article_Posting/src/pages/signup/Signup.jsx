import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Yup validation schema
const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required").min(2, "Too short"),
  lastName: yup.string().required("Last Name is required").min(2, "Too short"),
  email: yup.string().required("Email is required").email("Invalid email format"),
});

const Signup = () => {
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
      const response = await axios.post(`${frontendUrl}/api/users/create`, data);
      toast.success(response.data.message || "Signup successful! Check your email.");
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      console.error("Signup error:", error);
    }
  };

  return (
    
    <div>
      <ToastContainer position="top-center" />
      <div>
        <h1 className="text-3xl font-bold text-center mt-8">Signup</h1>
        <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">
              First Name
            </label>
            <input
              id="firstName"
              {...register("firstName")}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.firstName ? "border-red-500" : ""
              }`}
              placeholder="Enter your first name"
              aria-invalid={errors.firstName ? "true" : "false"}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs italic" role="alert">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
              Last Name
            </label>
            <input
              id="lastName"
              {...register("lastName")}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.lastName ? "border-red-500" : ""
              }`}
              placeholder="Enter your last name"
              aria-invalid={errors.lastName ? "true" : "false"}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs italic" role="alert">
                {errors.lastName.message}
              </p>
            )}
          </div>

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
