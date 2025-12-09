import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsersPage = () => {
  const [roles, setRoles] = useState([]);
  const [bases, setBases] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    roleId: "",
    baseId: "",
  });

  const apiBase = process.env.REACT_APP_API_BASE_URL || "";

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [rolesRes, basesRes, usersRes] = await Promise.all([
          axios.get(`https://military-asset-management-system-backend-80y6.onrender.com/api/roles`),
          axios.get(`https://military-asset-management-system-backend-80y6.onrender.com/api/bases`),
          axios.get(`https://military-asset-management-system-backend-80y6.onrender.com/api/users`),
        ]);

        setRoles(rolesRes.data);
        setBases(basesRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Failed to load admin data", err);
      }
    };

    loadInitial();
  }, [apiBase]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        username: form.username,
        password: form.password,
        fullName: form.fullName,
        roleId: form.roleId,
        baseId: form.baseId || null,
      };

      const res = await axios.post(`http://localhost:4000/api/users`, payload);

      setUsers((prev) => [res.data, ...prev]);

      setForm({
        username: "",
        password: "",
        fullName: "",
        roleId: "",
        baseId: "",
      });
    } catch (err) {
      console.error("Failed to create user", err);
      alert("Failed to create user");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">User Management</h2>
        <span className="badge bg-danger">Admin</span>
      </div>

      {/* Create User Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">Create User</div>

        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            {/* Username */}
            <div className="col-md-4">
              <label className="form-label">Username</label>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Password */}
            <div className="col-md-4">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Full Name */}
            <div className="col-md-4">
              <label className="form-label">Full Name</label>
              <input
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Role */}
            <div className="col-md-4">
              <label className="form-label">Role</label>
              <select
                name="roleId"
                value={form.roleId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Base */}
            <div className="col-md-4">
              <label className="form-label">Base (optional for ADMIN)</label>
              <select
                name="baseId"
                value={form.baseId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">None</option>
                {bases.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit button */}
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-danger">
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Users Table */}
      <div className="card shadow-sm">
        <div className="card-header">Users</div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Base</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.fullName}</td>
                    <td>{u.roleName || u.role?.name}</td>
                    <td>{u.baseName || u.base?.name || "-"}</td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-3 text-muted">
                      No users created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
