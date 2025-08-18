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
  const [page, setPage] = useState(1);          // pagination state
  const [totalPages, setTotalPages] = useState(1);
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchDraftArticles = async (search = "", currentPage = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${frontendUrl}/api/articles/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: {
          search,
          all: "false",
          type: "draft",
          page: currentPage,
          limit: 10
        },
      });
      setArticles(res.data.articles.articles);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch drafted articles:", error);
      toast.error("Failed to fetch drafted articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraftArticles(debouncedSearchTerm.trim(), page);
  }, [debouncedSearchTerm, page]);

  const handleArticle = () => {
    navigate("/create-article");
  };

  return (
    <Layout>
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="text"
            placeholder="Search by title, author name, or email..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // reset to page 1 on search
            }}
          />
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
          <p className="text-center text-lg text-red-500">No articles found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
              {articles.map((article) => (
                <Card key={article._id || article.id} article={article} />
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
    </Layout>
  );
};

export default DraftedArticle;
