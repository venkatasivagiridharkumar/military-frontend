import React, { useEffect, useState } from "react";
import api from "../api/apiClient";

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);

        const res = await api.get("http://localhost:4000/api/dashboard");
        setMetrics(res.data);

      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading || !metrics) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Dashboard</h2>
        <span className="badge bg-secondary">Overview</span>
      </div>

      {/* Metric Cards */}
      <div className="row g-3">
        <MetricCard label="Opening Balance" value={metrics.openingBalance} variant="primary" />
        <MetricCard label="Purchases" value={metrics.purchases} variant="success" />
        <MetricCard label="Transfers In" value={metrics.transfersIn} variant="info" />
        <MetricCard label="Transfers Out" value={metrics.transfersOut} variant="warning" />
        <MetricCard label="Assigned" value={metrics.assigned} variant="dark" />
        <MetricCard label="Expended" value={metrics.expended} variant="danger" />
        <MetricCard label="Closing Balance" value={metrics.closingBalance} variant="primary" />
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, variant = "primary" }) => (
  <div className="col-12 col-sm-6 col-md-4 col-lg-3">
    <div className={`card border-${variant} shadow-sm h-100`}>
      <div className="card-body">
        <p className="card-subtitle text-muted small mb-1">{label}</p>
        <h4 className="card-title mb-0">{value ?? 0}</h4>
      </div>
    </div>
  </div>
);

export default DashboardPage;
