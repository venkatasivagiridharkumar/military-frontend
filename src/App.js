import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PurchasesPage from "./pages/PurchasesPage";
import TransfersPage from "./pages/TransfersPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import AdminUsersPage from "./pages/AdminUsersPage";

/* ----------------------------- Protected Route ----------------------------- */
function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();

  // Redirect guests to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If route requires specific roles, check authorization
  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/* -------------------------------- Application -------------------------------- */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Private Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Redirect root → dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Main Pages */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="purchases" element={<PurchasesPage />} />
            <Route path="transfers" element={<TransfersPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />

            {/* Admin-only */}
            <Route
              path="admin/users"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all → redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
