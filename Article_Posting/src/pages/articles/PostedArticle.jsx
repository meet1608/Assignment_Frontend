import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../../components/Card"; 

const PostedArticle = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem("token");
    axios
       .get("http://localhost:8080/api/articles/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
      .then((res) => {
        setArticles(
          res.data.articles.filter((article) => article.type === "published")
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 sm:pl-36 sm:pr-24 min-h-screen bg-gray-50">
      

      {loading ? (
        <p className="text-center text-lg text-gray-500">Loading Articles...</p>
      ) : articles.length === 0 ? (
        <p className="text-center text-lg text-red-500">No published articles found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
          {articles.map((article) => (
            <Card key={article._id || article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostedArticle;
