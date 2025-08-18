import React, { useState } from "react";
import axios from "../../components/TokenExpires";
import Layout from "../../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  articleImage: yup
  .mixed()
  .test("fileSize", "File size is too large", (value) => {
    if (!value || value.length === 0) return true; 
    return value[0].size <= 5 * 1024 * 1024; 
  })

});

const CreateArticle = () => {
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); 
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const onSubmit = async (data, articleType) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("type", articleType);
    if (data.articleImage?.[0]) formData.append("articleImage", data.articleImage[0]);

    try {
      const res = await axios.post(`${frontendUrl}/api/articles/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success(res.data.message || "Article submitted!");
      reset();
      setPreviewImage(null); // 
      const user = JSON.parse(localStorage.getItem("user"));
      let redirectPath = "/";
      if (articleType === "published") {
        redirectPath = user?.role === "admin" ? "/admin/articles" : "/";
      } else if (articleType === "draft") {
        redirectPath = "/draft-article";
      }
      setTimeout(() => navigate(redirectPath), 500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error uploading article";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-center" />
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md mt-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">Create Article</h2>
        <form className="flex flex-col gap-4">
        
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
            <input
              type="text"
              {...register("title")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter article title"
              autoComplete="off"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Content</label>
            <textarea
              {...register("content")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black min-h-[80px]"
              placeholder="Write your article here..."
            />
            {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Article Image</label>
            <input
              type="file"
              {...register("articleImage")}
              accept="image/*"
              onChange={handleFileChange}   
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer py-2"
            />
            {errors.articleImage && <p className="text-red-500 text-sm">{errors.articleImage.message}</p>}
          </div>

          <label className="block text-sm font-medium mb-1 text-gray-700">Current Image</label>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto object-cover rounded-lg border border-gray-300"
            />
          )}

          <button
            type="button"
            onClick={handleSubmit((data) => onSubmit(data, "draft"))}
            className={`mt-2 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold hover:bg-black transition ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Draft Article"}
          </button>
          <button
            type="button"
            onClick={handleSubmit((data) => onSubmit(data, "published"))}
            className={`mt-2 py-2 rounded-lg bg-black text-white font-semibold hover:bg-black transition ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Post Article"}
          </button>
        </form>
      </div>
    </Layout>
  );
};


export default CreateArticle;
