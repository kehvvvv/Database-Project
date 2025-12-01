import { useState } from "react";
import "./signUp.css";

function SignUpFields() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
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
    const res = await fetch("http://localhost:8000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data.message);
  }

  return (
    <section className="d-flex flex-column flex-grow-1 sign-up-section">
      <h1>Sign Up</h1>

      <form
        className="d-flex flex-column flex-grow-1 sign-up-form"
        style={{ height: "50vh" }}
        method="post"
        onSubmit={handleSubmit}
      >
        <div className="signUp">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="signUp">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

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
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="signUp">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            value={formData.phoneNumber}
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
          Create Account
        </button>
      </form>
    </section>
  );
}

export default SignUpFields;