import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "2rem" }}>Cafestagram</h1>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => navigate("/login")}
        >
          Log In
        </button>

        <button
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#2196F3",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Home;
