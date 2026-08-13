import {
  FaCheckCircle,
  FaShoppingBag,
  FaHome,
  FaReceipt,
} from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";

import "../styles/ordersuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;

  // If user directly opens /order-success
  // without placing an order
  if (!order) {
    return (
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon">
            <FaCheckCircle />
          </div>

          <h1>Order Completed</h1>

          <p>
            Your order information is no longer available on this page.
          </p>

          <button
            className="home-btn"
            onClick={() => navigate("/orders")}
          >
            <FaShoppingBag />
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  const paymentMethod =
    order.payment_method === "COD"
      ? "Cash on Delivery"
      : order.payment_method === "UPI"
        ? "UPI"
        : order.payment_method === "CARD"
          ? "Credit / Debit Card"
          : order.payment_method;

  const itemCount = order.items?.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="success-page">
      <div className="success-card">
        {/* SUCCESS ICON */}
        <div className="success-icon">
          <FaCheckCircle />
        </div>

        <h1>Order Confirmed!</h1>

        <p>
          Your fresh groceries are being prepared.
        </p>

        {/* DELIVERY */}
        <div className="delivery-card">
          <h3>🚴 Estimated Delivery</h3>

          <h2>10 Minutes</h2>

          <span>
            Sit back and relax. We'll be there soon.
          </span>
        </div>

        {/* ORDER INFORMATION */}
        <div className="order-info">
          <div>
            <span>Order ID</span>

            <strong>#{order.id}</strong>
          </div>

          <div>
            <span>Payment</span>

            <strong>{paymentMethod}</strong>
          </div>

          <div>
            <span>Items</span>

            <strong>{itemCount}</strong>
          </div>

          <div>
            <span>Total</span>

            <strong>₹{order.total_amount}</strong>
          </div>
        </div>

        {/* VIEW ORDER */}
        <button
          className="track-btn"
          onClick={() => navigate(`/orders/${order.id}`)}
        >
          <FaReceipt />
          View Order Details
        </button>

        {/* CONTINUE SHOPPING */}
        <button
          className="home-btn"
          onClick={() => navigate("/")}
        >
          <FaHome />
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;