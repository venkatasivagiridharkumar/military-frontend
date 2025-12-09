import React, { useEffect, useState } from "react";
import api from "../api/apiClient";

const PurchasesPage = () => {
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const [form, setForm] = useState({
    baseId: "",
    equipmentTypeId: "",
    quantity: "",
    unitCost: "",
    purchaseDate: "",
    remarks: "",
  });

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [basesRes, eqRes, listRes] = await Promise.all([
          api.get("https://military-asset-management-system-backend-80y6.onrender.com/api/bases"),
          api.get("https://military-asset-management-system-backend-80y6.onrender.com/api/equipment-types"),
          api.get("https://military-asset-management-system-backend-80y6.onrender.com/api/purchases"),
        ]);

        setBases(basesRes.data);
        setEquipmentTypes(eqRes.data);
        setPurchases(listRes.data);

      } catch (err) {
        console.error("Failed to load purchase initial data", err);
      }
    };

    loadInitial();
  }, []);

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
      const res = await api.post("/api/purchases", form);

      setPurchases((prev) => [res.data, ...prev]);

      setForm({
        baseId: "",
        equipmentTypeId: "",
        quantity: "",
        unitCost: "",
        purchaseDate: "",
        remarks: "",
      });

    } catch (err) {
      console.error("Failed to create purchase", err);
      alert("Failed to create purchase");
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Purchases</h2>
        <span className="badge bg-primary">Increase Stock</span>
      </div>

      {/* Purchase Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">Record Purchase</div>

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

            {/* Unit Cost */}
            <div className="col-md-4">
              <label className="form-label">Unit Cost</label>
              <input
                name="unitCost"
                type="number"
                step="0.01"
                value={form.unitCost}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Purchase Date */}
            <div className="col-md-4">
              <label className="form-label">Purchase Date</label>
              <input
                name="purchaseDate"
                type="date"
                value={form.purchaseDate}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Remarks */}
            <div className="col-md-4">
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
              <button type="submit" className="btn btn-success">
                Record Purchase
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Purchase Table */}
      <div className="card shadow-sm">
        <div className="card-header">Purchase History</div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Base</th>
                  <th>Equipment</th>
                  <th>Qty</th>
                  <th>Unit Cost</th>
                  <th>Date</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.baseName || p.baseId}</td>
                    <td>{p.equipmentName || p.equipmentTypeId}</td>
                    <td>{p.quantity}</td>
                    <td>{p.unitCost}</td>
                    <td>{p.purchaseDate}</td>
                    <td>{p.remarks}</td>
                  </tr>
                ))}

                {purchases.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-3 text-muted">
                      No purchases recorded yet.
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

export default PurchasesPage;
