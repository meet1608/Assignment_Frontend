import React, { useState, useEffect } from "react";
import axios from "../../components/TokenExpires";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import {jwtDecode} from "jwt-decode";

const PostedArticle = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;


  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(user?.role === "admin"){
      navigate("/admin/articles");
    }
    else{
      navigate("/");
    }

  },[navigate]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchArticles = async (
    search = "",
    filterValue = "",
    currentPage = 1,
    limitValue = limit
  ) => {
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
          limit: limitValue,
        },
      });
      const articlesData = res.data?.articles?.articles || res.data?.articles || [];
      setArticles(Array.isArray(articlesData) ? articlesData : []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("You don’t have permission to view published articles.");
      } else {
        toast.error("Failed to fetch articles. Please try again.");
      }
      setArticles([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(debouncedSearchTerm.trim(), filter, page, limit);
  }, [debouncedSearchTerm, filter, page, limit]);

  const handleArticle = () => navigate("/create-article");

  return (
    <div className="p-6 sm:pl-36 sm:pr-24 min-h-screen bg-gray-50 ">
      <ToastContainer />
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <input
          type="text"
          placeholder="Search by title, author name, or email..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Articles</option>
          <option value="my-articles">My Articles</option>
        </select>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 w-full sm:w-1/4 transition-colors"
          onClick={handleArticle}
        >
          Add Article
        </button>
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-500">Loading Articles...</p>
      ) : articles.length === 0 ? (
        <p className="text-center text-lg text-red-500">No articles found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, idx) => (
              <Card key={article._id || article.id || idx} article={article} />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <div className="flex items-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
              <FaArrowLeft />
              </button>
              <span className="text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                <FaArrowRight />
              </button>
            </div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={3}>3 per page</option>
              <option value={5}>5 per page</option>
              <option value={6}>6 per page</option>
              <option value={9}>9 per page</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default PostedArticle;
