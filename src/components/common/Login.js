import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../style.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      ); // Ensure cookies are sent with the request

      if (response.status === 200) {
        const user = response.data;
        sessionStorage.setItem("user", JSON.stringify(user));

        // Navigate based on user role
        if (user.role === 0) {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error", error);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Log in</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <p>
            By continuing, you agree to the{" "}
            <a href="/privacy-policy">Privacy Policy</a>.
          </p>
          <div className="form-group">
            <input type="submit" value="Log in" />
          </div>
          {error && <span className="error-message">{error}</span>}
        </form>
        <div className="additional-links">
          <a href="/forgot-password">Forgot your password?</a>
          <br />
          <p>
            Don’t have an account? <a href="/register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
