import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
function MainFeed() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedPostID, setSelectedPostID] = useState(null);
  const username = useParams();

  async function handleSubmit(e, postID) {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:8000/api/post/${e.target.elements.postID.value}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postID: e.target.elements.postID.value,
          username: e.target.elements.username.value,
          date: e.target.elements.date.value,
          comment: e.target.elements.comment.value,
        }),
      }
    );
    const data = await res.json();
    console.log(data.message);
  }
  // button was clicked and changes state of comment form
  const toggleForm = (postID) => {
    if (selectedPostID === postID) setSelectedPostID(null);
    else setSelectedPostID(postID);
  };

  useEffect(() => {
    if (!selectedPostID) return;
    async function loadComments() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/post/${selectedPostID}/comments`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setComments(data.comments);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    }
    loadComments();
  }, [selectedPostID]);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/post/${username.username}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setPosts(data.posts);
        console.log("status: ", data.status);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    }
    loadPosts();
  }, []);
  return (
    <div className="d-flex flex-column">
      <h2>Today's Posts</h2>
      {posts.map((p) => (
        <div key={p.postID}>
          <h3>{p.username}</h3>
          <small>{p.date}</small>
          <div>{p.location}</div>
          <div>{p.imageURL}</div>
          <p>{p.description}</p>
          <div>Number of Likes: {p.likesCount}</div>
          <button onClick={() => toggleForm(p.postID)}>
            {selectedPostID === p.postID ? "Close Comment" : "Comment"}
          </button>
          {selectedPostID === p.postID && (
            <form onSubmit={handleSubmit}>
              <div id="comment-id-{{ p.postID }}">
                <input type="hidden" name="postID" value={p.postID} />
                <input type="hidden" name="username" value={p.username} />
                <input type="hidden" name="date" value={p.date} />
                <input
                  type="text"
                  name="comment"
                  placeholder="Create Comment"
                ></input>
                <button type="submit">Submit Comment</button>
              </div>
            </form>
          )}
          {comments.length > 0 ? (
            comments
              .filter((c) => c.postID === p.postID)
              .map((c) => (
                <div key={c.commentID} className="comment">
                  <strong>{c.username}</strong>: {c.comment}
                </div>
              ))
          ) : (
            <p></p>
          )}
        </div>
      ))}
    </div>
  );
}
export default MainFeed;