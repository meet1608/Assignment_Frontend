import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/AdminSideBar';
import Card from '../../components/Card';
import axios from 'axios';

const Admin_home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios
      .get("http://localhost:8080/api/articles/all")
      .then((res) => {
        setArticles(
          res.data.articles.filter((article) => article.type === "published")
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6 sm:pr-24 overflow-y-auto">
        {loading ? (
          <p className="text-center text-lg text-gray-500">Loading Articles...</p>
        ) : articles.length === 0 ? (
          <p className="text-center text-lg text-red-500">No published articles found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article._id || article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin_home;
