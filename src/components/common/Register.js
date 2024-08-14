import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../style.css";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setUser({
      username: "",
      password: "",
      email: "",
    });
    setErrors({});
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/register",
        user
      );
      if (response.status === 200) {
        setMessage("Registration successful");
        navigate("/login");
      } else {
        setMessage(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage("Username already in use");
      } else {
        setMessage("An error occurred during registration. Please try again.");
      }
      console.error("Registration error", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div className="form-group">
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
            {errors.username && (
              <p className="error-message">{errors.username}</p>
            )}
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>
          <div className="form-group">
            <input
              type="text"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="form-group">
            <input type="submit" value="Save" className="btn btn-primary" />
            <input type="reset" value="Reset" className="btn btn-secondary" />
          </div>
        </form>
        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
