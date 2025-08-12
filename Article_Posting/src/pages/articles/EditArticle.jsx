import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";

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
  useEffect(() => {
    axios
      .get(`${frontendUrl}/api/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setArticle(res.data.article);
      });
  }, [id]);

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e, articleType) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", article.title);
    formData.append("content", article.content);
    formData.append("type", articleType);
    if (newImage) {
      formData.append("articleImage", newImage);
    }

    try {
      await axios.put(`${frontendUrl}/api/articles/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (user.role === "admin") navigate("/admin/articles");
      else navigate("/");
    } catch (error) {
      console.error("Error updating article:", error);
    }

    setSubmitting(false);
  };

  return (
    <div>
<Layout>
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Article</h2>
      <form encType="multipart/form-data">
        <input
          type="text"
          name="title"
          value={article.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 w-full mb-4"
        />
        <textarea
          name="content"
          value={article.content}
          onChange={handleChange}
          placeholder="Content"
          className="border p-2 w-full mb-4 h-40"
        />

        <label className="block mb-2">Current Image:</label>
        {article.articleImage && (
          <img
            src={`${frontendUrl}${article.articleImage}`}
            alt="Current"
            className="h-40 object-cover mb-4"
          />
        )}
        <input type="file" name="articleImage" onChange={handleImageChange} />
        <div className="flex gap-4 justify-end">
          <button
            onClick={(e) => handleSubmit(e, "draft")}
            type="submit"
            className={`mt-2 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold hover:bg-black transition ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Draft Article"}
          </button>
          <button
            onClick={(e) => handleSubmit(e, "published")}
            className={`mt-2 py-2 rounded-lg bg-black text-white font-semibold hover:bg-black transition ${
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
    </div>
  );
};

export default EditArticle;
