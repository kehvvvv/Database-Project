import { useState } from "react";
import "./signUp.css";
function Post({ postClickedOut, currentUser }) {
  const date = new Date();
  const current_date = date.toLocaleDateString();
  const [formData, setFormData] = useState({
    username: currentUser,
    location: "",
    imageURL: "",
    description: "",
    likesCount: 0,
    date: current_date,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Post submitted:", formData);
    const res = await fetch("http://localhost:8000/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data.message);
  }
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  return (
    <div className="d-flex flex-column" style={{ height: "100%" }}>
      <nav className="d-flex ">
        <button style={{ width: "5%" }} onClick={postClickedOut}></button>
        <h2 className="d-flex flex-grow-1 justify-content-center">Post</h2>
      </nav>
      <main
        className="d-flex flex-column flex-grow-1 justify-content-center align-items-center"
        style={{
          height: "100%",
        }}
      >
        <form
          className="d-flex flex-column"
          style={{ height: "100%" }}
          method="post"
          onSubmit={handleSubmit}
        >
          <div className="signUp">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="signUp">
            <label htmlFor="imageURL">Insert Image:</label>
            <input
              type="text"
              id="imageURL"
              value={formData.imageURL}
              onChange={handleChange}
              required
            />
          </div>
          <div className="signUp">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="signUpButton">
            submit
          </button>
        </form>
      </main>
    </div>
  );
}
export default Post;
