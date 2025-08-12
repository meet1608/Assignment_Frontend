import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
const Articles = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${frontendUrl}/api/articles/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch article");
        const data = await res.json();
        setArticle(data.article);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 50 }}>Loading...</p>;
  if (error)
    return (
      <p style={{ textAlign: "center", marginTop: 50, color: "red" }}>
        Error: {error}
      </p>
    );
  if (!article)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>No article found.</p>
    );

  const createdDate = new Date(article.createdAt);
  const formattedDate = createdDate.toLocaleDateString();
  const formattedTime = createdDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Layout>
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 30,
        backgroundColor: "#fff",
        borderRadius: 10,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        lineHeight: 1.6,
        color: "#333",
      }}
    >
      <h1
        style={{
          marginBottom: 10,
          fontWeight: "700",
          fontSize: "2.0rem",
          color: "#222",
        }}
      >
        {article.title}
      </h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 20,
          gap: 15,
        }}
      >
        <img
          src={`${frontendUrl}${article.user.profileImage}`}
          alt={`${article.user.firstName} ${article.user.lastName}`}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #007bff",
          }}
        />
        <div>
          <p style={{ margin: 0, fontWeight: "600", fontSize: "1.1rem" }}>
            {article.user.firstName} {article.user.lastName}
          </p>
          <p style={{ margin: 0, color: "#555", fontSize: "0.9rem" }}>
            {article.user.email}
          </p>
        </div>
        <span
          style={{ marginLeft: "auto", color: "#888", fontSize: "0.85rem" }}
        >
          {formattedDate} at {formattedTime}
        </span>
      </div>

      {article.articleImage && (
        <img
          src={`${frontendUrl}${article.articleImage}`}
          alt={article.title}
          style={{
            width: "100%",
            maxHeight: 450,
            objectFit: "cover",
            borderRadius: 10,
            marginBottom: 25,
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          }}
        />
      )}

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #eee",
          marginBottom: 25,
        }}
      />

      <div
        style={{
          whiteSpace: "pre-wrap",
          fontSize: "1.15rem",
          color: "#444",
          letterSpacing: "0.02em",
        }}
      >
        {article.content}
      </div>
    </div>
    </Layout>
  );
};

export default Articles;
