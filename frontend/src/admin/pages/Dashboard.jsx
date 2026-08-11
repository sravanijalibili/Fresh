import { useEffect, useState } from "react";

import { getDashboard } from "../services/adminService";
import StatCard from "../components/StatCard";

import "../styles/dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const data = await getDashboard();

    setStats(data);
  };

  if (!stats) return <h2>Loading...</h2>;

  return (
    <div className="dashboard">
      <div className="dashboard-title">
        <h1>Dashboard</h1>

        <p>Welcome to Fresh Admin Panel</p>
      </div>

      <div className="dashboard-grid">
        <StatCard title="Products" value={stats.products} color="#4caf50" />

        <StatCard title="Customers" value={stats.customers} color="#2196f3" />

        <StatCard title="Orders" value={stats.orders} color="#ff9800" />

        <StatCard
          title="Pending"
          value={stats.pending_orders}
          color="#f44336"
        />

        <StatCard
          title="Delivered"
          value={stats.delivered_orders}
          color="#009688"
        />

        <StatCard
          title="Cancelled"
          value={stats.cancelled_orders}
          color="#9c27b0"
        />
      </div>
    </div>
  );
}

export default Dashboard;
