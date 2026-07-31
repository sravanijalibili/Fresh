import { FaCheckCircle, FaShoppingBag, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/ordersuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();

  const orderId = "FR" + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">
          <FaCheckCircle />
        </div>

        <h1>Order Confirmed!</h1>

        <p>Your fresh groceries are being prepared.</p>

        <div className="delivery-card">
          <h3>🚴 Estimated Delivery</h3>

          <h2>10 Minutes</h2>

          <span>Sit back and relax. We'll be there soon.</span>
        </div>

        <div className="order-info">
          <div>
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>

          <div>
            <span>Payment</span>
            <strong>Cash on Delivery</strong>
          </div>
        </div>

        <button
          className="track-btn"
          onClick={() => toast("Tracking will be available soon 🚴")}
        >
          <FaShoppingBag />
          Track Order
        </button>

        <button className="home-btn" onClick={() => navigate("/")}>
          <FaHome />
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;
