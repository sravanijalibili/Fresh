import { FaCheckCircle, FaShoppingBag, FaHome } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import "../styles/ordersuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;

  const getPaymentMethod = () => {
    if (order?.payment_method === "COD") {
      return "Cash on Delivery";
    }

    if (order?.payment_method === "UPI") {
      return "UPI";
    }

    if (order?.payment_method === "CARD") {
      return "Credit / Debit Card";
    }

    return order?.payment_method || "N/A";
  };

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

          <span>
            Sit back and relax. We'll be there soon.
          </span>
        </div>

        <div className="order-info">
          <div>
            <span>Order ID</span>

            <strong>
              #{order?.id || "N/A"}
            </strong>
          </div>

          <div>
            <span>Payment</span>

            <strong>
              {getPaymentMethod()}
            </strong>
          </div>

          <div>
            <span>Total</span>

            <strong>
              ₹{order?.total_amount || "0.00"}
            </strong>
          </div>
        </div>

        <button
          className="track-btn"
          onClick={() => {
            if (order?.id) {
              navigate(`/orders/${order.id}`);
            } else {
              toast("Order details are not available");
            }
          }}
        >
          <FaShoppingBag />
          Track Order
        </button>

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