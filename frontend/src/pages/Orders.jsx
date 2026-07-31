import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import "../styles/orders.css";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders")) || [];

    setOrders(data);
  }, []);

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

                <span className="status">{order.status}</span>
              </div>

              <p>{order.date}</p>

              <p>{order.items.length} Items</p>

              <h2>₹{order.total}</h2>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Orders;
