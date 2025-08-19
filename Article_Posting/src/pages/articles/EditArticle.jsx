import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../components/TokenExpires";
import Layout from "../../components/proflayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    }),
});

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState({
    title: "",
    content: "",
    type: "",
    articleImage: "",
  });
  const [newImage, setNewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchArticle = async () => {
    try {
      const res = await axios.get(`${frontendUrl}/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data?.article) {
        setArticle(res.data.article);
        setValue("title", res.data.article.title);
        setValue("content", res.data.article.content);
      } else throw new Error("Article data not found");
    } catch (error) {
      console.error("Failed to fetch article for edit:", error);
      toast.error("Failed to load article data");
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const onSubmit = async (data, articleType) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("type", articleType);
      if (newImage) formData.append("articleImage", newImage);

      await axios.put(`${frontendUrl}/api/articles/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Article updated successfully");

      let redirectPath = "/";
      if (articleType === "published") {
        redirectPath = user?.role === "admin" ? "/admin/articles" : "/";
      } else if (articleType === "draft") {
        redirectPath = "/draft-article";
      }

      setTimeout(() => navigate(redirectPath), 500);
    } catch (error) {
      console.error(
        "Error updating article:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to update article");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
  <div className="relative">
    <ToastContainer position="top-center" />
    <div className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition">
        <h2 className="text-3xl font-semibold text-center mb-4 text-black">
          Edit Article
        </h2>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Title
            </label>
            <input
              type="text"
              {...register("title")}
              placeholder="Enter article title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              disabled={submitting}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Content
            </label>
            <textarea
              {...register("content")}
              placeholder="Enter article content"
              className="border p-2 w-full mb-1 h-40 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              disabled={submitting}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>

          <label className="block">Current Image:</label>
          {article.articleImage && (
            <img
              src={`${frontendUrl}${article.articleImage}`}
              alt="Current"
              className="h-40 object-cover mb-4 rounded-lg"
            />
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Article Image
            </label>
            <input
              type="file"
              onChange={(e) => setNewImage(e.target.files[0])}
              accept="image/*"
              disabled={submitting}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer py-2 pl-2"
            />
            {errors.articleImage && (
              <p className="text-red-500 text-sm">{errors.articleImage.message}</p>
            )}
          </div>

          <div className="flex gap-4 justify-end mt-4">
            <button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data, "draft"))}
              className={`mt-2 py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 
              text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 
              focus:ring-2 focus:ring-blue-400 transition ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Save as Draft"}
            </button>

            <button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data, "published"))}
              className={`mt-2 py-2 px-4 rounded-lg bg-black text-white font-semibold shadow-md 
              hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 transition ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</Layout>

  );
};

export default EditArticle;
