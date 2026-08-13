import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaChevronRight } from "react-icons/fa";
import toast from "react-hot-toast";

import PageHeader from "../components/PageHeader";
import { getOrders } from "../services/orderService";

import "../styles/orders.css";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();

      setOrders(data);
    } catch (error) {
      console.error(error);

      toast.error("Unable to load orders");
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <>
      <PageHeader title="My Orders" />

      <div className="orders-page">
        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-orders-icon">
              <FaBoxOpen />
            </div>

            <h2>No Orders Yet</h2>

            <p>Your placed orders will appear here.</p>

            <button onClick={() => navigate("/")}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div
                className="order-card"
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="order-card-header">
                  <div>
                    <span className="order-label">Order</span>

                    <h3>#{order.id}</h3>
                  </div>

                 <span
                    className={`status ${order.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-date">
                  {new Date(order.created_at).toLocaleString()}
                </div>

                <div className="order-card-bottom">
                  <div>
                    <span className="order-items">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "Item" : "Items"}
                    </span>

                    <strong>₹{order.total_amount}</strong>
                  </div>

                  <FaChevronRight className="order-arrow" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Orders;