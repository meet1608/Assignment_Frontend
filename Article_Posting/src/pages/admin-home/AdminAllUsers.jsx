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
  const navigate = useNavigate(); // Initialize useNavigate
  const admin = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users/all", {
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
                    `http://localhost:8080/api/users/delete/${userId}`,
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
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="min-w-full mt-4 border">
  <thead>
    <tr>
      <th className="border px-4 py-2 text-center align-middle">Profile Picture</th>
      <th className="border px-4 py-2 text-center align-middle">Full Name</th>
      <th className="border px-4 py-2 text-center align-middle">Email</th>
      <th className="border px-4 py-2 text-center align-middle">Role</th>
      <th className="border px-4 py-2 text-center align-middle">Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.map((user) => (
      <tr key={user._id}>
        <td className="border px-4 py-2 text-center align-middle">
          <img
            src={
              user.profileImage
                ? `http://localhost:8080${user.profileImage}`
                : "/default-profile.png"
            }
            alt="Profile"
            className="w-10 h-10 rounded-full mx-auto"
          />
        </td>
        <td className="border px-4 py-2 text-center align-middle">
          {user.firstName} {user.lastName}
        </td>
        <td className="border px-4 py-2 text-center align-middle">
          {user.email}
        </td>
        <td className="border px-4 py-2 text-center align-middle">
          {user.role}
        </td>
        <td className="border px-4 py-2 flex space-x-2 justify-center items-center align-middle">
          {admin.id !== user._id && (
            <button
              className="text-blue-500 hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded"
              onClick={() => navigate(`/edit-user/${user._id}`)}
            >
              <FaPen className="h-5 w-5" />
            </button>
          )}
          {admin.id !== user._id && (
            <button
              className="text-red-500 hover:bg-red-700 hover:text-white font-bold py-2 px-4 rounded"
              onClick={() => handleDeleteUser(user._id)}
            >
              <MdDelete className="h-6 w-6" />
            </button>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>

        )}
      </div>
    </div>
  );
};

export default AdminAllUsers;
