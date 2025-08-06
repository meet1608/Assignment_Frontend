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

  
  if (loading) return <div>Loading...</div>;
  if (!profile) return <div onClick={()=>{navigate('/')}}>No profile found.</div>;

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
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="flex flex-row items-center justify-end">
        <button
          onClick={handleProfile}
          className="mb-4 px-4 py-2 rounded-full hover:bg-black hover:text-white"
        >
          <FaPen className="h-5 w-5" />
        </button>
        <button
          onClick={handleDelete}
          className="mb-4 px-4 py-2 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white ml-2"
        >
          <MdDelete className="h-6 w-6" />
        </button>
      </div>
      <img
        src={profile.profileImage 
         ? `http://localhost:8080${profile.profileImage}` 
         : "/default-profile.png"}
        alt="Profile"
        className="w-32 h-32 rounded-full bg-black text-white mb-4"
      />
      <p>
        <strong>First Name:</strong> {profile.firstName}
      </p>
      <p>
        <strong>Last Name:</strong> {profile.lastName}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Role:</strong> {profile.role}
      </p>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Update Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full"
                />
                {form.profileImage && (
                  <img
                    src={form.profileImage}
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

export default Profile;
