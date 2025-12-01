import { useState } from "react";
import { useParams } from "react-router-dom";

export default function FollowButton({ profileUser }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const { username } = useParams();
  const handleClick = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/account/follow/${username}/${profileUser.username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        setIsFollowing((prev) => !prev);
      } else {
        console.error("Follow error:", data.message);
      }
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "8px 16px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        backgroundColor: isFollowing ? "#e5e7eb" : "#3b82f6",
        color: isFollowing ? "#111" : "#fff",
        fontWeight: 500,
      }}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
