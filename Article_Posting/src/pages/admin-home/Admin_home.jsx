import React, { useState, useEffect } from "react";
import Sidebar from "../../components/AdminSideBar";
import Card from "../../components/Card";
import axios from "../../components/TokenExpires";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

const AdminHome = () => {
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
      setArticles(res.data.articles);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      toast.error("Failed to fetch articles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(debouncedSearchTerm.trim(), filter, page, limit);
  }, [debouncedSearchTerm, filter, page, limit]);

  const handleArticle = () => navigate("/create-article");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ToastContainer />
      <Sidebar />
      <div className="flex-1 p-6 sm:pr-24 overflow-y-auto">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Search by title or author name"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
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
          <p className="text-center text-lg text-gray-500">
            Loading Articles...
          </p>
        ) : articles.length === 0 ? (
          <p className="text-center text-lg text-red-500">No articles found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Card
                  key={article._id || article.id}
                  article={article}
                  onDelete={async (id) => {
                    toast.success("✅ Article deleted");

                    let replacement = null;
                    try {
                      const needOne = articles.length - 1 < limit;
                      if (needOne) {
                        const { data } = await fetchArticles(
                          debouncedSearchTerm.trim(),
                          filter,
                          page + 1,
                          1
                        );
                        replacement = data?.articles?.[0] ?? null;
                      }
                    } catch (err) {
                      console.error("Backfill fetch failed:", err);
                    }

                    setArticles((prev) => {
                      const updated = prev.filter((a) => a._id !== id);
                      if (
                        updated.length < limit &&
                        replacement &&
                        !updated.some((a) => a._id === replacement._id)
                      ) {
                        return [...updated, replacement];
                      }
                      return updated;
                    });

                    Promise.resolve().then(async () => {
                      if (typeof fetchArticles !== "function") return;
                      try {
                        const { data } = await fetchArticles(
                          debouncedSearchTerm.trim(),
                          filter,
                          page,
                          limit
                        );
                        setArticles((curr) =>
                          curr.length < limit ? data.articles : curr
                        );
                      } catch (e) {
                        console.error("Hard refresh failed:", e);
                      }
                    });
                  }}
                />
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
    </div>
  );
};

export default AdminHome;
