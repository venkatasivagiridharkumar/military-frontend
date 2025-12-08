import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">MAMS</span>

          <div className="d-flex align-items-center ms-auto">
            {user && (
              <span className="text-white me-3 small">
                {user.fullName} ({user.role}
                {user.baseName ? ` - ${user.baseName}` : ""})
              </span>
            )}

            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <aside className="bg-white border-end" style={{ width: "240px" }}>
          <div className="p-3">
            <p className="text-muted text-uppercase small mb-2">Navigation</p>

            <nav className="nav nav-pills flex-column gap-2">
              <NavLink to="/dashboard" className="nav-link">
                Dashboard
              </NavLink>

              <NavLink to="/purchases" className="nav-link">
                Purchases
              </NavLink>

              <NavLink to="/transfers" className="nav-link">
                Transfers
              </NavLink>

              <NavLink to="/assignments" className="nav-link">
                Assignments
              </NavLink>

              {isAdmin && (
                <NavLink to="/admin/users" className="nav-link">
                  User Management
                </NavLink>
              )}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow-1">
          <div className="container-fluid py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
