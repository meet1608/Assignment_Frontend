import React, { useState, useEffect } from "react";
import axios from "../../components/TokenExpires";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostedArticle = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

  const handleArticle = () => {
    navigate("/create-article");
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchArticles = async (search = "", filterValue = "", currentPage = 1) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token missing. Please log in again.");
      navigate("/login");
      setLoading(false);
      return;
    }
    const all = filterValue === "my-articles" ? "false" : "true";
    try {
      const res = await axios.get(`${frontendUrl}/api/articles/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search,
          all,
          type: "published",
          page: currentPage,
          limit: 9
        },
      });
      const articlesData =
        res.data?.articles?.articles || res.data?.articles || [];
      setArticles(Array.isArray(articlesData) ? articlesData : []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (error) {
      if (error.response?.status === 403) {
        console.warn("Access denied: You don't have permission to view published articles.");
        toast.error("You don’t have permission to view published articles.");
      } else {
        console.error("Error fetching articles:", error);
        toast.error("Failed to fetch articles. Please try again.");
      }
      setArticles([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(debouncedSearchTerm.trim(), filter, page);
  }, [debouncedSearchTerm, filter, page]);

  return (
    <div className="p-6 sm:pl-36 sm:pr-24 min-h-screen bg-gray-50">
      <ToastContainer />
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
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
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
          No articles found.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article, idx) => (
              <Card key={article._id || article.id || idx} article={article} />
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostedArticle;
