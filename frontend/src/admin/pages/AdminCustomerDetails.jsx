import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getAdminCustomer } from "../services/adminCustomerService";

import "../styles/customer-details.css";

function AdminCustomerDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [customerData, setCustomerData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomer();
  }, [id]);

  const loadCustomer = async () => {
    try {
      setLoading(true);

      const data = await getAdminCustomer(id);

      setCustomerData(data);
    } catch (error) {
      console.error(error);

      toast.error("Unable to load customer details");

      navigate("/admin/customers");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-customer-details">
        <div className="customer-details-loading">
          Loading customer details...
        </div>
      </div>
    );
  }

  if (!customerData) {
    return null;
  }

  const customer = customerData.customer;

  const addresses = customerData.addresses || [];

  const orders = customerData.orders || [];

  return (
    <div className="admin-customer-details">
      {/* =================================================
                TOP
            ================================================= */}

      <div className="customer-details-top">
        <button
          className="back-customer-btn"
          onClick={() => navigate("/admin/customers")}
        >
          ← Back to Customers
        </button>
      </div>

      {/* =================================================
                CUSTOMER HEADER
            ================================================= */}

      <div className="customer-profile-card">
        <div className="customer-avatar">
          {customer.username?.charAt(0)?.toUpperCase()}
        </div>

        <div className="customer-profile-info">
          <h2>{customer.username}</h2>

          <p>{customer.email || "No email"}</p>

          <span>Customer #{customer.id}</span>
        </div>
      </div>

      {/* =================================================
                STATISTICS
            ================================================= */}

      <div className="customer-stat-grid">
        <div className="customer-stat-card">
          <span>Total Orders</span>

          <strong>{customer.order_count || 0}</strong>
        </div>

        <div className="customer-stat-card">
          <span>Total Spent</span>

          <strong>₹{Number(customer.total_spent || 0).toFixed(2)}</strong>
        </div>

        <div className="customer-stat-card">
          <span>Joined</span>

          <strong className="joined-date">
            {new Date(customer.date_joined).toLocaleDateString()}
          </strong>
        </div>
      </div>

      {/* =================================================
                ADDRESSES
            ================================================= */}

      <div className="customer-details-card">
        <div className="details-card-header">
          <h3>Saved Addresses</h3>

          <span>{addresses.length}</span>
        </div>

        {addresses.length === 0 ? (
          <div className="details-empty">No saved addresses.</div>
        ) : (
          <div className="customer-address-grid">
            {addresses.map((address) => (
              <div
                className={`customer-address ${
                  address.is_default ? "default-address" : ""
                }`}
                key={address.id}
              >
                <div className="address-header">
                  <strong>{address.full_name}</strong>

                  {address.is_default && (
                    <span className="default-badge">Default</span>
                  )}
                </div>

                <p>{address.phone}</p>

                <p>
                  {address.house}, {address.street}
                </p>

                <p>
                  {address.city}, {address.state}
                </p>

                <p>{address.pincode}</p>

                {address.latitude !== null && address.longitude !== null && (
                  <button
                    className="view-location-btn"
                    onClick={() =>
                      window.open(
                        `https://www.openstreetmap.org/?mlat=${address.latitude}&mlon=${address.longitude}#map=17/${address.latitude}/${address.longitude}`,
                        "_blank"
                      )
                    }
                  >
                    📍 View Location
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =================================================
                ORDERS
            ================================================= */}

      <div className="customer-details-card">
        <div className="details-card-header">
          <h3>Order History</h3>

          <span>{orders.length}</span>
        </div>

        {orders.length === 0 ? (
          <div className="details-empty">
            This customer has not placed any orders yet.
          </div>
        ) : (
          <div className="customer-orders-table-wrapper">
            <table className="customer-orders-table">
              <thead>
                <tr>
                  <th>Order</th>

                  <th>Date</th>

                  <th>Items</th>

                  <th>Payment</th>

                  <th>Total</th>

                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>

                    <td>{new Date(order.created_at).toLocaleString()}</td>

                    <td>{order.items?.length || 0}</td>

                    <td>{order.payment_method}</td>

                    <td>
                      <strong>
                        ₹{Number(order.total_amount || 0).toFixed(2)}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`customer-order-status ${order.status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCustomerDetails;
