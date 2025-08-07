import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    profileImage: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      fetch(`http://localhost:8080/api/users/get/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );
  if (!profile)
    return (
      <div
        className="flex items-center justify-center h-screen bg-gray-100 cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        <div className="text-lg text-gray-700 bg-white p-6 rounded shadow">
          No profile found.
        </div>
      </div>
    );

  const handleProfile = () => {
    setForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      profileImage: profile.profileImage,
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDelete = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      fetch(`http://localhost:8080/api/users/delete/${user.id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          window.location.href = "/login";
        })
        .catch((err) => console.log(err));
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files.length > 0) {
      setSelectedFile(files[0]);
      setForm((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(files[0]),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }

    fetch(`http://localhost:8080/api/users/update/${user.id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("user", JSON.stringify(data.user));
        setProfile(data.user);
        setShowModal(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              My Profile
            </h1>
            <span className="text-gray-400 text-sm">
              Account settings & details
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleProfile}
              title="Edit Profile"
              className="p-2 rounded-full text-blue-600 border border-gray-200 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <FaPen className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              title="Delete Account"
              className="p-2 rounded-full border border-gray-200 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            >
              <MdDelete className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center my-6">
          <div className="relative">
            <img
              src={
                profile.profileImage
                  ? `http://localhost:8080${profile.profileImage}`
                  : "/default-profile.png"
              }
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-blue-200 shadow"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">
            {profile.firstName} {profile.lastName}
          </h2>
          <span className="text-gray-500">{profile.email}</span>
        </div>
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <div className="text-xs text-gray-400 font-medium">First Name</div>
              <div className="text-base font-semibold text-gray-700">
                {profile.firstName}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Last Name</div>
              <div className="text-base font-semibold text-gray-700">
                {profile.lastName}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Email</div>
              <div className="text-base font-medium text-gray-600">
                {profile.email}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Role</div>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mt-1">
                {profile.role}
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8 relative">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Update Profile
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-500 text-sm mb-1 font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-500 text-sm mb-1 font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-500 text-sm mb-1 font-medium">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full text-gray-700"
                  />
                  {form.profileImage && (
                    <img
                      src={form.profileImage}
                      alt="Preview"
                      className="w-16 h-16 rounded-full mt-3 border border-gray-200 object-cover"
                    />
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
