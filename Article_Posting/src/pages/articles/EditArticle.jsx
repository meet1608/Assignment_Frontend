import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchArticle = async () => {
    try {
      const res = await axios.get(`${frontendUrl}/api/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data?.article) setArticle(res.data.article);
      else throw new Error("Article data not found");
    } catch (error) {
      console.error("Failed to fetch article for edit:", error);
      toast.error("Failed to load article data");
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e, articleType) => {
    e.preventDefault();
    setSubmitting(true);

    if (!article.title.trim() || !article.content.trim()) {
      toast.error("Title and content cannot be empty");
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", article.title);
      formData.append("content", article.content);
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
        <form encType="multipart/form-data" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="title"
            value={article.title}
            onChange={handleChange}
            placeholder="Title"
            className="border p-2 w-full mb-4"
            disabled={submitting}
          />
          <textarea
            name="content"
            value={article.content}
            onChange={handleChange}
            placeholder="Content"
            className="border p-2 w-full mb-4 h-40"
            disabled={submitting}
          />
          <label className="block mb-2">Current Image:</label>
          {article.articleImage && (
            <img
              src={`${frontendUrl}${article.articleImage}`}
              alt="Current"
              className="h-40 object-cover mb-4"
            />
          )}
          <input
            type="file"
            name="articleImage"
            onChange={handleImageChange}
            disabled={submitting}
          />
          <div className="flex gap-4 justify-end mt-4">
            <button
              onClick={(e) => handleSubmit(e, "draft")}
              className={`py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold hover:bg-black transition ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Draft Article"}
            </button>
            <button
              onClick={(e) => handleSubmit(e, "published")}
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
