import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";

const Edit_User = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "user",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state?.userData) {
      const usr = state.userData;
      setFormData({
        firstName: usr.firstName || "",
        lastName: usr.lastName || "",
        role: usr.role || "user",
      });
      setLoading(false);
    } else {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`${frontendUrl}/api/users/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setFormData({
            firstName: res.data.firstName || "",
            lastName: res.data.lastName || "",
            role: res.data.role || "user",
          });
        } catch (error) {
          console.error("Error fetching user:", error);
          alert("Failed to fetch user data");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${frontendUrl}/api/users/update-by-admin/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("User updated successfully");
      navigate("/admin/users");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64 text-gray-600 text-lg">
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl px-8 py-10">
          <div className="flex flex-col items-center mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Update User
            </h1>
           
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-500 text-sm mb-1 font-medium">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm mb-1 font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm mb-1 font-medium">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Edit_User;
