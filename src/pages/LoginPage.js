import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = "Basic " + btoa(username + ":" + password);

    try {
      const res = await api.get("http://localhost:4000/api/auth/me", {
        headers: {
          Authorization: token,
        },
      });

      login(res.data, token);
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Invalid credentials or server error");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center bg-dark bg-gradient min-vh-100">
      <div className="card shadow-lg" style={{ minWidth: "360px" }}>

        {/* Header */}
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">MAMS Login</h4>
        </div>

        {/* Body */}
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">

            {/* Username */}
            <div className="col-12">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>

            {/* Password */}
            <div className="col-12">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="col-12">
                <div className="alert alert-danger py-2 mb-0">
                  {error}
                </div>
              </div>
            )}

            {/* Login Button */}
            <div className="col-12 d-grid">
              <button type="submit" className="btn btn-primary">
                Sign In
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="card-footer text-muted small text-center">
          Military Asset Management System
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
