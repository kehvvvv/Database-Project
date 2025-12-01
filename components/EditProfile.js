import { useState } from "react";
import "./signUp.css";
function EditProfile({ postClickedOut, currentUser }) {
  const date = new Date();
  const current_date = date.toLocaleDateString();
  const [formData, setFormData] = useState({
    username: currentUser,
    biography: "",
    profilePic: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Post submitted:", formData);
    const res = await fetch(
      `http://localhost:8000/api/account/${currentUser}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    const data = await res.json();
    console.log(data.status);
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
        <button style={{ width: "5%" }} onClick={postClickedOut}>
          X
        </button>
        <h2 className="d-flex flex-grow-1 justify-content-center">
          Edit Profile
        </h2>
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
            <label htmlFor="profilePic">Insert Profile Pic:</label>
            <input
              type="text"
              id="profilePic"
              value={formData.profilePic}
              onChange={handleChange}
              required
            />
          </div>
          <div className="signUp">
            <label htmlFor="biography">Biography:</label>
            <input
              type="text"
              id="biography"
              value={formData.biography}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="updateProfile">
            Update Profile
          </button>
        </form>
      </main>
    </div>
  );
}
export default EditProfile;