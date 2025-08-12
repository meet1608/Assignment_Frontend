import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../../components/Card"; 
import Layout from "../../components/Layout";
const PostedArticle = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios
      .get(`${frontendUrl}/api/articles/all`,{
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }})
      .then((res) => {
        setArticles(
          res.data.articles.filter((article) => article.type === "draft" && article.user._id === user.id)
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Layout>
    <div className="p-6 sm:pl-36 sm:pr-24 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Draft Articles
      </h2>

      {loading ? (
        <p className="text-center text-lg text-gray-500">Loading Articles...</p>
      ) : articles.length === 0 ? (
        <p className="text-center text-lg text-red-500">No draft articles found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
          {articles.map((article) => (
            <Card key={article._id || article.id} article={article} />
          ))}
        </div>
      )}
    </div>
    </Layout>
  );
};

export default PostedArticle;
