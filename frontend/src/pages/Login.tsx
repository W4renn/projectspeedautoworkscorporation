import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loggedUser = await auth.login(username, password);
    if (loggedUser) {
      navigate(loggedUser.role === "admin" || loggedUser.role === "staff" ? "/admin" : "/");
    } else {
      setError("Invalid credentials");
    }
  };


  return (
    <div className="admin-login-dashboard">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1>Log-In</h1>
          <p>Enter your credentials to access the dashboard</p>
        </div>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="add-btn">
            Login
          </button>

          <p className="forgot-password-link">
            <a
              href="mailto:dwiwoiii2003@gmail.com?subject=Password Reset Request&body=Hello,%0D%0A%0D%0AI forgot my password and would like to request a reset.%0D%0A%0D%0AThank you."
            >
              Forgot Password?
            </a>
          </p>

          {error && <p className="login-error">{error}</p>}

          <p className="signup-link">
            No account? <a href="/signup">Signup here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

