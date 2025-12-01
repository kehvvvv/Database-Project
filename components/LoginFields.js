import { useState } from "react";
import "./signUp.css";
import { useNavigate } from "react-router-dom";

function LoginFields() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Form submitted:", formData);
    const res = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data.message);
    if (data.status === "success") {
      navigate(`/main/${data.username}`);
    }
  }

  return (
    <section className="d-flex flex-column flex-grow-1 sign-up-section">
      <h1>Login</h1>

      <form
        className="d-flex flex-column flex-grow-1 sign-up-form"
        style={{ height: "50vh" }}
        method="post"
        onSubmit={handleSubmit}
      >
        <div className="signUp">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="signUp">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="signUpButton">
          Log in
        </button>
      </form>
    </section>
  );
}

export default LoginFields;