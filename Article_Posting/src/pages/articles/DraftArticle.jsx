import React, { useState, useEffect } from "react";
import axios from "../../components/TokenExpires";
import Card from "../../components/Card";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import SideBar from "../../components/AdminSideBar";
import BackButton from "../../components/BackButtons";

const DraftedArticle = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);

  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchDraftArticles = async (
    search = "",
    currentPage = 1,
    limitValue = limit
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(`${frontendUrl}/api/articles/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: {
          search,
          all: "false",
          type: "draft",
          page: currentPage,
          limit: limitValue,
        },
      });
      setArticles(res.data.articles);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch drafted articles:", error);
      toast.error("Failed to fetch drafted articles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraftArticles(debouncedSearchTerm.trim(), page, limit);
  }, [debouncedSearchTerm, page, limit]);

  const handleArticle = () => navigate("/create-article");

  const contentPadding =
    user?.role === "admin" ? "pl-6 p-6" : "p-6 sm:pl-36 sm:pr-24";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {user?.role === "admin" && (
        <div className="w-64 min-h-screen bg-gray-800 shadow-md">
          <SideBar />
        </div>
      )}

      <div className={`flex-1 min-h-screen ${contentPadding}`}>
        <ToastContainer />

        <BackButton />

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
        ) : !articles || articles.length === 0 ? (
          <p className="text-center text-lg text-red-500">No articles found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
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
                        const { data } = await axios.get(
                          `${frontendUrl}/api/articles/all`,
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                            params: {
                              search: debouncedSearchTerm.trim(),
                              all: "false",
                              type: "draft",
                              page: page + 1,
                              limit: 1,
                            },
                          }
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
                      try {
                        const res = await axios.get(
                          `${frontendUrl}/api/articles/all`,
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                            params: {
                              search: debouncedSearchTerm.trim(),
                              all: "false",
                              type: "draft",
                              page,
                              limit,
                            },
                          }
                        );
                        const fresh = res.data?.articles ?? [];
                        setArticles((curr) =>
                          curr.length < limit ? fresh : curr
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

export default DraftedArticle;
