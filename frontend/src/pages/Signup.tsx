import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import "./Signup.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState<"admin" | "user">("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await auth.register(username, password, role);
    setLoading(false);
    if (result === true) {
      alert("Account created successfully! Please login.");
      navigate("/login");
    } else {
      setError(typeof result === 'string' ? result : 'Registration failed.');
    }
  };


  return (
    <div className="signup-dashboard">
      <div className="signup-box">
        <div className="signup-header">
          <h1>Sign-Up</h1>
          <p>Create your account to access dashboard or book appointments</p>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
          {error && <p className="signup-error">{error}</p>}
          <p className="login-link">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

