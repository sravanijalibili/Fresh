import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getAdminCustomers } from "../services/adminCustomerService";

import "../styles/customers.css";

function AdminCustomers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const data = await getAdminCustomers();

      setCustomers(data);
    } catch (error) {
      console.error(error);

      toast.error("Unable to load customers");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-customers">
        <h2>Customers</h2>

        <div className="customers-loading">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="admin-customers">
      <div className="page-top">
        <div>
          <h2>Customers</h2>

          <p className="customers-subtitle">Manage registered customers</p>
        </div>

        <div className="customer-total-count">{customers.length} Customers</div>
      </div>

      {customers.length === 0 ? (
        <div className="empty-customers">
          <h3>No Customers Found</h3>

          <p>Registered customers will appear here.</p>
        </div>
      ) : (
        <div className="customers-table-wrapper">
          <table className="admin-customers-table">
            <thead>
              <tr>
                <th>Customer</th>

                <th>Email</th>

                <th>Joined</th>

                <th>Orders</th>

                <th>Total Spent</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="customer-row"
                  onClick={() => navigate(`/admin/customers/${customer.id}`)}
                >
                  <td>
                    <div className="customer-name">
                      <strong>{customer.username}</strong>

                      <span>#{customer.id}</span>
                    </div>
                  </td>

                  <td>{customer.email || "No email"}</td>

                  <td>{new Date(customer.date_joined).toLocaleDateString()}</td>

                  <td>
                    <span className="customer-order-badge">
                      {customer.order_count}
                    </span>
                  </td>

                  <td>
                    <strong>
                      ₹{Number(customer.total_spent || 0).toFixed(2)}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;
