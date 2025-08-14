import React, { useState, useEffect } from "react";
import axios from "../../components/TokenExpires";
import Card from "../../components/Card";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DraftedArticle = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchDraftArticles = async (search = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${frontendUrl}/api/articles/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { search, all: "false", type: "draft" }, 
      });
      setArticles(res.data.articles);
    } catch (error) {
      console.error("Failed to fetch drafted articles:", error);
      toast.error("Failed to fetch drafted articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraftArticles(debouncedSearchTerm.trim());
  }, [debouncedSearchTerm]);

  const handleArticle = () => {
    navigate("/create-article");
  };

  return (
    <Layout>
      <div className="p-6  min-h-screen bg-gray-50">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="text"
            placeholder="Search by title, author name, or email..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4 cursor-pointer text-center"
            onClick={handleArticle}
          >
            Add Article
          </div>
        </div>

        {loading ? (
          <p className="text-center text-lg text-gray-500">
            Loading Articles...
          </p>
        ) : articles.length === 0 ? (
          <p className="text-center text-lg text-red-500">
            No draft articles found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
            {articles.map((article) => (
              <Card key={article._id || article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DraftedArticle;
