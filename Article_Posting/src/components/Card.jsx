import React from "react";
import {
  Card, CardActionArea, CardMedia, CardContent, CardActions, Avatar,
  IconButton, Typography, Tooltip
} from "@mui/material";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatDate = (iso) => new Date(iso).toLocaleDateString();

export default function ImgMediaCard({ article }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

  const handleEdit = () => navigate(`/edit-article/${article._id}`);

  const handleDelete = (articleId) => {
    toast(
      ({ closeToast }) => (
        <div style={{ padding: "8px" }}>
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
            🗑 Are you sure you want to delete this article?
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={async () => {
                try {
                  await fetch(`${frontendUrl}/api/articles/delete/${articleId}`, {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  });
                  closeToast();
                  toast.success("✅ Article deleted", { autoClose: 2000 });
                  window.location.reload();
                } catch (error) {
                  toast.error("❌ Failed to delete");
                }
              }}
              style={{
                background: "#ef4444", color: "#fff",
                border: "none", padding: "6px 16px", borderRadius: "6px",
                fontWeight: "bold", cursor: "pointer",
              }}
            >Yes, Delete</button>
            <button
              onClick={closeToast}
              style={{
                background: "#374151", color: "#fff",
                border: "none", padding: "6px 16px", borderRadius: "6px",
                fontWeight: "bold", cursor: "pointer",
              }}
            >Cancel</button>
          </div>
        </div>
      ),
      {
        autoClose: false, closeOnClick: false,
        style: {
          background: "#1f2937", color: "#f9fafb",
          borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.22)",
        },
      }
    );
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: 2,
        borderRadius: 4,
        boxShadow: 4,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 8 }
      }}
      elevation={0}
    >
      <ToastContainer position="top-center" />
      <CardActionArea
        onClick={() => navigate(`/article/${article._id}`)}
        sx={{ borderRadius: 4 }}
      >
        <CardMedia
          component="img"
          image={`${frontendUrl}${article.articleImage}`}
          alt={article.title}
          sx={{
            height: 340, 
            objectFit: "cover",
            borderRadius: 3,
          }}
        />
      </CardActionArea>

      <CardContent sx={{ pt: 2 }}>
        <div style={{
          display: "flex", alignItems: "center", marginBottom: "1em"
        }}>
          <Avatar
            src={`${frontendUrl}${article.user.profileImage}`}
            alt={article.user.firstName}
            sx={{ width: 32, height: 32, bgcolor: "#3b82f6", marginRight: 1 }}
          />
          <Typography variant="subtitle2">
            {article.user.firstName} {article.user.lastName}
          </Typography>
          
        </div>
         <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
          {formatDate(article.createdAt)}
        </Typography>
        <Typography variant="subtitle2">
            {article.user.email}
          </Typography>
       
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mt: 1, mb: 1.5 }}
        >
          {article.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "3.6em"
          }}
        >
          {article.content}
        </Typography>
      </CardContent>

      <CardActions disableSpacing sx={{ justifyContent: "flex-end", px: 2, pb: 1 }}>
        {(article.user._id === user?.id || user?.role === "admin") && (
          <>
            <Tooltip title="Edit"><IconButton
              color="info" onClick={handleEdit} sx={{
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "#3b82f6", color: "#fff" }
              }}>
              <FaPen size={18} />
            </IconButton></Tooltip>
            <Tooltip title="Delete"><IconButton
              color="error"
              onClick={e => {
                e.stopPropagation();
                handleDelete(article._id);
              }}
              sx={{
                bgcolor: "background.paper", ml: 0.5,
                "&:hover": { bgcolor: "#ef4444", color: "#fff" }
              }}>
              <MdDelete size={22} />
            </IconButton></Tooltip>
          </>
        )}
      </CardActions>
    </Card>
  );
}
