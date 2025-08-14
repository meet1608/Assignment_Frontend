import React, { useState, useEffect } from "react";
import axios from "../../components/TokenExpires";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Card from "../../components/Card";

const PostedArticle = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(""); // "" or "my-articles"
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
const navigate = useNavigate();
  const location = useLocation();
const handleArticle = () => {
    navigate("/create-article");
  };
useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 1000);

  return () => clearTimeout(handler);
}, [searchTerm]);

  
  const fetchArticles = async (search = "", filterValue = "") => {
  setLoading(true);
  const token = localStorage.getItem("token");
  const all = filterValue === "my-articles" ? "false" : "true";

  try {
    const res = await axios.get(`${frontendUrl}/api/articles/all`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { search, all,type:"published" },
    });
    setArticles(res.data.articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    toast.error("Failed to fetch articles");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchArticles(debouncedSearchTerm.trim(), filter);
  }, [debouncedSearchTerm, filter]);

  return (
    <div className="p-6 sm:pl-36 sm:pr-24 min-h-screen bg-gray-50">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
  <input
    type="text"
    placeholder="Search by title, author name, or email..."
    className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <select
    className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4"
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
  >
    <option value="">All Articles</option>
    <option value="my-articles">My Articles</option>
  </select>

  <div
    className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4 cursor-pointer text-center"
    onClick={handleArticle}
  >
    Add Article
  </div>
</div>


      {loading ? (
        <p className="text-center text-lg text-gray-500">Loading Articles...</p>
      ) : articles.length === 0 ? (
        <p className="text-center text-lg text-red-500">
          No matching published articles found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <Card key={article._id || article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostedArticle;
