import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignmentsPage = () => {
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [form, setForm] = useState({
    baseId: "",
    equipmentTypeId: "",
    assignedTo: "",
    quantity: "",
    remarks: "",
  });

  const apiBase = process.env.REACT_APP_API_BASE_URL || "";

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [basesRes, eqRes, listRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/bases`),
          axios.get(`http://localhost:4000/api/equipment-types`),
          axios.get(`http://localhost:4000/api/assignments`),
        ]);

        setBases(basesRes.data);
        setEquipmentTypes(eqRes.data);
        setAssignments(listRes.data);
      } catch (err) {
        console.error("Failed to load assignments initial data", err);
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
      const res = await axios.post(
        `http://localhost:4000/api/assignments`,
        form
      );

      setAssignments((prev) => [res.data, ...prev]);

      setForm({
        baseId: "",
        equipmentTypeId: "",
        assignedTo: "",
        quantity: "",
        remarks: "",
      });
    } catch (err) {
      console.error("Failed to create assignment", err);
      alert("Failed to create assignment");
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Assignments</h2>
        <span className="badge bg-info text-dark">Issue to Personnel</span>
      </div>

      {/* Assignment Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">Record Assignment</div>

        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            {/* Base */}
            <div className="col-md-4">
              <label className="form-label">Base</label>
              <select
                name="baseId"
                value={form.baseId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Base</option>
                {bases.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Equipment Type */}
            <div className="col-md-4">
              <label className="form-label">Equipment Type</label>
              <select
                name="equipmentTypeId"
                value={form.equipmentTypeId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Equipment</option>
                {equipmentTypes.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.code} - {e.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned To */}
            <div className="col-md-4">
              <label className="form-label">Assigned To</label>
              <input
                name="assignedTo"
                type="text"
                value={form.assignedTo}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Quantity */}
            <div className="col-md-4">
              <label className="form-label">Quantity</label>
              <input
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Remarks */}
            <div className="col-md-8">
              <label className="form-label">Remarks</label>
              <input
                name="remarks"
                type="text"
                value={form.remarks}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Submit */}
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-info text-white">
                Record Assignment
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Assignment History Table */}
      <div className="card shadow-sm">
        <div className="card-header">Assignments History</div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Base</th>
                  <th>Equipment</th>
                  <th>Assigned To</th>
                  <th>Qty</th>
                  <th>Assign Date</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {assignments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.baseName || a.baseId}</td>
                    <td>{a.equipmentName || a.equipmentTypeId}</td>
                    <td>{a.assignedTo}</td>
                    <td>{a.quantity}</td>
                    <td>{a.assignDate}</td>
                    <td>{a.remarks}</td>
                  </tr>
                ))}

                {assignments.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-3 text-muted">
                      No assignments recorded yet.
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

export default AssignmentsPage;
