import React, { useState, useEffect } from "react";
import axios from "../../components/TokenExpires";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profile from "../../assets/images/profile.avif";
const Edit_User = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "user",
    email: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${frontendUrl}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFormData({
        firstName: res.data.firstName || "",
        lastName: res.data.lastName || "",
        email: res.data.email || "",
        role: res.data.role || "user",
        profileImage: res.data.profileImage || "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state?.userData) {
      const usr = state.userData;
      setFormData({
        firstName: usr.firstName || "",
        lastName: usr.lastName || "",
        role: usr.role || "user",
        email: usr.email || "",
        profileImage: usr.profileImage || "",
      });
      setLoading(false);
    } else {
      fetchUser();
    }
  }, [id, state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("role", formData.role);
    if (formData.profileImage instanceof File) {
      data.append("profileImage", formData.profileImage);
    }

    await axios.put(`${frontendUrl}/api/users/update-by-admin/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    toast.success("User updated successfully");
    setTimeout(() => {
      navigate("/admin/users");
    }, 500);
  } catch (error) {
    console.error("Error updating user:", error.response?.data || error);
    toast.error("Failed to update user");
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
      <ToastContainer position="top-center" />
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
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
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
            <label className="block mb-2">Current Image:</label>
            {previewImage ? (
              <img
                src={previewImage}
                alt="New Preview"
                className="w-32 h-32 object-cover rounded-full"
              />
            ) : (
              formData.profileImage &&
              !(formData.profileImage instanceof File) && (
                <img
                  src={`${frontendUrl}${formData.profileImage}`|| profile}
                  alt="Current Image"
                  className="w-32 h-32 object-cover rounded-full"
                />
              )
            )}

            <input
              type="file"
              name="profileImage"
              onChange={handleImageChange}
            />

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
