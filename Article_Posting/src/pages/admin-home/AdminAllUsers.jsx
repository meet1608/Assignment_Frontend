import React, { useState, useEffect } from "react";
import SideBar from "../../components/AdminSideBar";
import axios from "axios";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const admin = JSON.parse(localStorage.getItem("user"));
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 2;

  useEffect(() => {
    axios
      .get(`${frontendUrl}/api/users/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const filteredUsers = res.data.filter((user) => user.role !== "admin");
        setUsers(filteredUsers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
  const loggedInUserEmail = user?.email || "";

  const filteredArticles = users.filter((user) => {
    const searchText =
      `${user.firstName} ${user.lastName} ${user.email} ${user.role}`.toLowerCase();
    return searchText.includes(searchTerm.toLowerCase().trim());
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredArticles.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const totalPages = Math.ceil(filteredArticles.length / usersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDeleteUser = async (userId) => {
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
                  await axios.delete(
                    `${frontendUrl}/api/users/delete/${userId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  );
                  setUsers((prevUsers) =>
                    prevUsers.filter((user) => user._id !== userId)
                  );
                  closeToast();
                  toast.success(" User deleted", { autoClose: 2000 });
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
        </div>
        {loading ? (
          <p>Loading users...</p>
        ) : filteredArticles.length === 0 ? (
          <p className="text-center text-lg text-red-500">
            No matching users found.
          </p>
        ) : (
          <div>
            <table className="min-w-full mt-4 border">
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="border px-4 py-2 text-center">
                      <img
                        src={
                          user.profileImage
                            ? `${frontendUrl}${user.profileImage}`
                            : "/default-profile.png"
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
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-500 text-white"
                }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-500 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAllUsers;
