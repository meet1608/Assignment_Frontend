import React, { useState, useEffect } from "react";
import SideBar from "../../components/AdminSideBar";
import axios from "axios";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
const AdminAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const admin = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users/all")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/delete/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <div className="flex-1 p-6 sm:pr-24 overflow-y-auto">
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="min-w-full mt-4 border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Profile Picture</th>
                <th className="border px-4 py-2">First Name</th>
                <th className="border px-4 py-2">Last Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border px-4 py-2">
                    <img
                      src={
                        user.profileImage
                          ? `http://localhost:8080${user.profileImage}`
                          : "/default-profile.png"
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="border px-4 py-2 justify-center items-center">
                    {user.firstName}
                  </td>
                  <td className="border px-4 py-2 justify-center">
                    {user.lastName}
                  </td>
                  <td className="border px-4 py-2 justify-center">
                    {user.email}
                  </td>
                  <td className="border px-4 py-2 justify-center">
                    {user.role}
                  </td>
                  <td className="border px-4 py-2 flex space-x-2 justify-center">
                    {admin.id !== user._id && (
                      <button
                        className="text-blue-500 hover:bg-blue-700  hover:text-white font-bold py-2 px-4 rounded"
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
