import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-start mb-4 relative">
      <button
        onClick={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate("/");
          }
        }}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md "
      >
        ← Back
      </button>
    </div>
  );
};

export default BackButton;
