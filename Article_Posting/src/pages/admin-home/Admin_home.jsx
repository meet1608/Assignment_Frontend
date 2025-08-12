import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/AdminSideBar';
import Card from '../../components/Card';
import axios from 'axios';

const Admin_home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  

  useEffect(() => {
    axios
      .get(`${frontendUrl}/api/articles/all`,{
        headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
      }})
      .then((res) => {
        setArticles(
          res.data.articles.filter((article) => article.type === "published")
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);


  const user = JSON.parse(localStorage.getItem("user")); 
const loggedInUserEmail = user?.email || "";

const filteredArticles = articles.filter((article) => {
  const searchText = `${article.title} ${article.user.firstName} ${article.user.lastName} ${article.user.email}`.toLowerCase();
const matchedSearch = searchText.includes(searchTerm.toLowerCase().trim());

  // const matchedSearch =
  //   article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   article.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   article.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   article.user.email.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesFilter =
    filter === "my-articles"
      ? article.user.email === loggedInUserEmail
      : true;

  return matchedSearch && matchesFilter;
});

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6 sm:pr-24 overflow-y-auto">
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
      </div>
        {loading ? (
          <p className="text-center text-lg text-gray-500">Loading Articles...</p>
        ) : filteredArticles.length === 0 ? (
          <p className="text-center text-lg text-red-500">No published articles found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article._id || article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin_home;
