import React, { useEffect, useState } from "react";
import axios from "axios";

const TransfersPage = () => {
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [transfers, setTransfers] = useState([]);

  const [form, setForm] = useState({
    fromBaseId: "",
    toBaseId: "",
    equipmentTypeId: "",
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
          axios.get(`http://localhost:4000/api/transfers`),
        ]);

        setBases(basesRes.data);
        setEquipmentTypes(eqRes.data);
        setTransfers(listRes.data);
      } catch (err) {
        console.error("Failed to load transfers initial data", err);
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
        `http://localhost:4000/api/transfers`,
        form
      );

      setTransfers((prev) => [res.data, ...prev]);

      setForm({
        fromBaseId: "",
        toBaseId: "",
        equipmentTypeId: "",
        quantity: "",
        remarks: "",
      });
    } catch (err) {
      console.error("Failed to create transfer", err);
      alert("Failed to create transfer");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Transfers</h2>
        <span className="badge bg-warning text-dark">Base → Base</span>
      </div>

      {/* Transfer Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">Record Transfer</div>

        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">

            {/* From Base */}
            <div className="col-md-4">
              <label className="form-label">From Base</label>
              <select
                name="fromBaseId"
                value={form.fromBaseId}
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

            {/* To Base */}
            <div className="col-md-4">
              <label className="form-label">To Base</label>
              <select
                name="toBaseId"
                value={form.toBaseId}
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

            {/* Equipment */}
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
              <button type="submit" className="btn btn-primary">
                Record Transfer
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Transfer History */}
      <div className="card shadow-sm">
        <div className="card-header">Transfers History</div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>From Base</th>
                  <th>To Base</th>
                  <th>Equipment</th>
                  <th>Qty</th>
                  <th>Transfer Date</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {transfers.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.fromBaseName || t.fromBaseId}</td>
                    <td>{t.toBaseName || t.toBaseId}</td>
                    <td>{t.equipmentName || t.equipmentTypeId}</td>
                    <td>{t.quantity}</td>
                    <td>{t.transferDate}</td>
                    <td>{t.remarks}</td>
                  </tr>
                ))}

                {transfers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-3 text-muted">
                      No transfers recorded yet.
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

export default TransfersPage;
