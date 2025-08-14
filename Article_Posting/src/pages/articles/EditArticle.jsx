import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../components/TokenExpires";
import Layout from "../../components/Layout";
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
    })
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
      if (user?.role === "admin") navigate("/admin/articles");
      else navigate("/");
    } catch (error) {
      console.error("Error updating article:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update article");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-center" />
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Article</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            {...register("title")}
            placeholder="Title"
            className="border p-2 w-full mb-1"
            disabled={submitting}
          />
          {errors.title && <p className="text-red-500 text-sm mb-2">{errors.title.message}</p>}

          <textarea
            {...register("content")}
            placeholder="Content"
            className="border p-2 w-full mb-1 h-40"
            disabled={submitting}
          />
          {errors.content && <p className="text-red-500 text-sm mb-2">{errors.content.message}</p>}

          <label className="block mb-2">Current Image:</label>
          {article.articleImage && (
            <img
              src={`${frontendUrl}${article.articleImage}`}
              alt="Current"
              className="h-40 object-cover mb-4"
            />
          )}
          <input type="file" onChange={(e) => setNewImage(e.target.files[0])} disabled={submitting} />

          <div className="flex gap-4 justify-end mt-4">
            <button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data, "draft"))}
              className={`py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold hover:bg-black transition ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Draft Article"}
            </button>

            <button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data, "published"))}
              className={`py-2 px-4 rounded-lg bg-black text-white font-semibold hover:bg-black transition ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Update Article"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditArticle;
