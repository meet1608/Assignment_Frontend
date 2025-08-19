import React, { useState, useEffect } from "react";
import SideBar from "../../components/AdminSideBar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../../components/TokenExpires";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import profile from "../../assets/images/profile.avif";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("First Name is required")
    .min(2, "Too short"),
  lastName: yup
    .string()
    .trim()
    .required("Last Name is required")
    .min(2, "Too short"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email format"),
  role: yup.string().oneOf(["user", "admin"]).required("Role is required"),
});

const AdminAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const admin = JSON.parse(localStorage.getItem("user"));
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const [ismodelopen, setIsModelOpen] = useState(false);
  const fetchAllUsers = async (search = "", limitValue = limit) => {
    setLoading(true);
    try {
      const res = await axios.get(`${frontendUrl}/api/users/all`, {
        params: { search, page, limit: limitValue },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const { users, pagination } = res.data;
      setUsers(users);
      console.log(users.length);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAllUsers(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, limit]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${frontendUrl}/api/users/create`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success(res.data.message || "User added successfully!");
      fetchAllUsers();
      reset();
      setIsModelOpen(false);
    } catch (error) {
      const errMsg =
        error.response?.data?.message || error.message || "Failed to add user.";
      toast.error(errMsg);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleAddUser = () => {
    setIsModelOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    const deleteUser = async () => {
      try {
        await axios.delete(`${frontendUrl}/api/users/delete/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        throw error;
      }
    };

    toast(
      ({ closeToast }) => (
        <div style={{ padding: "8px" }}>
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
            🗑 Are you sure you want to delete this user?
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={async () => {
                try {
                  await deleteUser();
                  setUsers((prevUsers) =>
                    prevUsers.filter((user) => user._id !== userId)
                  );
                  closeToast();
                  toast.success("User deleted", { autoClose: 2000 });
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                } catch (error) {
                  console.error("Error deleting user:", error);
                  toast.error("Failed to delete");
                }
              }}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "6px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "0.2s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#dc2626")}
              onMouseOut={(e) => (e.target.style.background = "#ef4444")}
            >
              Yes, Delete
            </button>

            <button
              onClick={closeToast}
              style={{
                background: "#6b7280",
                color: "#fff",
                border: "none",
                padding: "6px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "0.2s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#4b5563")}
              onMouseOut={(e) => (e.target.style.background = "#6b7280")}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        style: {
          background: "#1f2937",
          color: "#f9fafb",
          borderRadius: "8px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ToastContainer position="top-center" />

      <SideBar />

      <div className="flex-1 p-6 sm:pr-24 overflow-y-auto">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="text"
            placeholder="Search by title, author name, or email..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 w-full sm:w-1/4 transition-colors text-center cursor-pointer"
            onClick={handleAddUser}
          >
            Add User
          </div>
        </div>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-lg text-red-500">
            No matching users found.
          </p>
        ) : (
          <div>
            <table className="min-w-full mt-4 border border-gray-300 rounded-lg">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-center align-middle">
                    Profile Picture
                  </th>

                  <th className="border px-4 py-2 text-center align-middle">
                    Full Name
                  </th>
                  <th className="border px-4 py-2 text-center align-middle">
                    Email
                  </th>
                  <th className="border px-4 py-2 text-center align-middle">
                    Role
                  </th>
                  <th className="border px-4 py-2 text-center align-middle">
                    Email Verified
                  </th>

                  <th className="border px-4 py-2 text-center align-middle">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="border px-4 py-2 text-center">
                      <img
                        src={
                          user.profileImage
                            ? `${frontendUrl}${user.profileImage}`
                            : profile
                        }
                        alt="Profile"
                        className="w-10 h-10 rounded-full mx-auto"
                      />
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {user.email}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {user.role}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {user.isEmailVerified ? "Yes" : "No"}
                    </td>
                    <td className="border px-4 py-2 flex justify-center gap-2">
                      {admin.id !== user._id && (
                        <button
                          className="text-blue-500 hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded"
                          onClick={() =>
                            navigate(`/admin/edit-user/${user.id}`, {
                              state: { userData: user },
                            })
                          }
                        >
                          <FaPen className="h-5 w-5" />
                        </button>
                      )}
                      {admin.id !== user._id && (
                        <button
                          className="text-red-500 hover:bg-red-700 hover:text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <MdDelete className="h-6 w-6" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                <FaArrowLeft />
              </button>
              <span className="px-3 py-1">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                <FaArrowRight />
              </button>

              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={15}>15 per page</option>
                <option value={20}>20 per page</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {ismodelopen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* First Name */}
              <div className="mb-4">
                <input
                  {...register("firstName")}
                  placeholder="First Name"
                  className={`w-full border rounded px-3 py-2 ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <input
                  {...register("lastName")}
                  placeholder="Last Name"
                  className={`w-full border rounded px-3 py-2 ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Email"
                  className={`w-full border rounded px-3 py-2 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>
              {/* Role */}
              <div className="mb-4">
                <select
                  {...register("role")}
                  defaultValue="user" // ✅ default selection
                  className={`w-full border rounded px-3 py-2 ${
                    errors.role ? "border-red-500" : ""
                  }`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs">{errors.role.message}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModelOpen(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default AdminAllUsers;
