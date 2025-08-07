import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function ImgMediaCard({ article }) {
  const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/edit-article/${article._id}`);
  };

  const handleDelete = async(article) => {
    try {
      await fetch(`http://localhost:8080/api/articles/delete/${article}`, {
        method: "DELETE",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  }
 
  return (
    <Card sx={{ maxWidth: 345 }} className="m-4">
      <CardContent>
        <div className="flex items-center">
          <img
            src={`http://localhost:8080${article.autherProfileImage}`}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-2"
          />
          <span className="font-medium">{article.autherName}</span>
        </div>
      </CardContent>
      <CardMedia
        component="img"
        alt={article.title}
        height="140"
        image={`http://localhost:8080${article.articleImage}`}
        sx={{ objectFit: "cover", height: "300px" }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {article.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {article.content}
        </Typography>
      </CardContent>

      <CardActions>
  {(article.user === user?.id || user?.role === "admin") && (
    <>
      <Button
        onClick={handleEdit}
        size="small"
        className="bg-white text-blue-500 rounded-full hover:bg-blue-500 hover:text-white"
      >
        <FaPen className="h-5 w-5" />
      </Button>
      <Button
        onClick={() => handleDelete(article._id)}
        size="small"
        className="bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white ml-2"
      >
        <MdDelete className="h-6 w-6" />
      </Button>
    </>
  )}
</CardActions>

    </Card>
  );
}
