import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const DraftArticle = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    articleImage: "",
    title: "",
    content: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/articles/all")
      .then((res) => {
        setArticles(
          res.data.articles.filter(
            (article) => article.user === user.id && article.type === "draft"
          )
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);



//   const handleProfile = () => {
//     setForm({
//       title: articles.title,
//       content: profile.lastName,
//       articleImage: profile.profileImage,
//     });
//     setSelectedFile(null);
//     setShowModal(true);
//   };

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-md mt-12">
      <h1>Welcome To Draft Article</h1>
      {loading ? (
        <p>Loading articles...</p>
      ) : (
        <table className="min-w-full mt-4 border flex-row items-center justify-center content-center">
          <thead>
            <tr>
              <th className="border px-4 py-2">Article Image</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Content</th>
              <th className="border px-4 py-2">Update</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td className="border px-4 py-2">
                  <img
                    src={
                      article.articleImage
                        ? `http://localhost:8080${article.articleImage}`
                        : "/default-profile.png"
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="border px-4 py-2">{article.title}</td>
                <td className="border px-4 py-2">{article.content}</td>
                <td className="border px-4 py-2 flex gap-4 justify-center">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Update
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Update Article</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Content</label>
                <input
                  type="text"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Article Image</label>
                <input
                  type="file"
                  name="articleImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full"
                />
                {form.profileImage && (
                  <img
                    src={form.articleImage}
                    alt="Preview"
                    className="w-16 h-16 rounded-full mt-2"
                  />
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftArticle;
