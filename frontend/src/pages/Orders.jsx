import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    } catch {
      toast.error("Unable to load orders");
    }
  };

  return (
    <>
      <PageHeader title="My Orders" />

      <div className="orders-page">
        {orders.length === 0 ? (
          <div className="empty-orders">
            <h2>No Orders Yet</h2>

            <p>Your placed orders will appear here.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              className="order-card"
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className="order-top">
                <h3>Order #{order.id}</h3>

                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <p>{new Date(order.created_at).toLocaleString()}</p>

              <p>{order.items.length} Item(s)</p>

              <h2>₹{order.total_amount}</h2>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Orders;
