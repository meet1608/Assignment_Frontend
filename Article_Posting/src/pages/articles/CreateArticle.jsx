import React, { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const CreateArticle = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    title: "",
    content: "",
    type:"",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e, articleType) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("type", articleType);
    formData.append("content", form.content);
    if (file) formData.append("articleImage", file);

    try {
      const res = await axios.post(
        `${frontendUrl}/api/articles/create`,
        formData,
        { headers: { "Content-Type": "multipart/form-data",
         Authorization: `Bearer ${localStorage.getItem("token")}`,

         } }
      );
             
      setMessage(res.data.message || "Article submitted!");
      setForm({ title: "", content: "", type: "" , articleImage: "" });
      setFile(null);
      toast.success(res.data.message || "Article submitted!");
      setTimeout(() => {
        navigate("/");
      },2000)
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Error uploading article"
      );
      toast.error(err.response?.data?.message || "Error uploading article");
    }
    setSubmitting(false);
  };

  return (
    <Layout>
            <ToastContainer position="top-center" />
      
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md mt-12">
      <h2 className="text-2xl font-bold text-center mb-6 text-black">Create Article</h2>
      <form className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter article title"
            value={form.title}
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1 text-gray-700">Content</label>
          <textarea
            name="content"
            id="content"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black min-h-[80px]"
            placeholder="Write your article here..."
            value={form.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1 text-gray-700">Article Image</label>
          <input
            type="file"
            name="articleImage"
            id="image"
            accept="image/*"
            className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer py-2"
            onChange={handleFileChange}
          />
        </div>
        <button
        onClick={(e) => handleSubmit(e, "draft")}
          type="submit"
          className={`mt-2 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold hover:bg-black transition ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Draft Article"}
        </button>



        <button
        onClick={(e) => handleSubmit(e, "published")}
          className={`mt-2 py-2 rounded-lg bg-black text-white font-semibold hover:bg-black transition ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Post Article"}
        </button>
      </form>
      {/* {message &&
        <div className="mt-6 text-center p-3 rounded-lg bg-gray-400 text-black font-medium">
          {message}
        </div>
      } */}
    </div>
    </Layout>
  );
};

export default CreateArticle;
