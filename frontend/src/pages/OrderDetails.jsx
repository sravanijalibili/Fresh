import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaBoxOpen,
  FaTimes,
} from "react-icons/fa";

import PageHeader from "../components/PageHeader";

import {
  getOrderDetails,
  cancelOrder,
} from "../services/orderService";

import toast from "react-hot-toast";

import OrderTimeline from "../components/OrderTimeline";
import API, { BASE_URL } from "../services/api";
import "../styles/orderdetails.css";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await getOrderDetails(id);

      setOrder(data);
    } catch (error) {
      console.error(error);

      toast.error("Unable to load order");
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setCancelling(true);

    try {
      await cancelOrder(id);

      toast.success("Order cancelled successfully");

      await loadOrder();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.error ||
          "Unable to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  if (!order) {
    return (
      <div className="order-loading">
        Loading order...
      </div>
    );
  }

  const canCancel =
    order.status !== "Delivered" &&
    order.status !== "Cancelled";

  return (
    <>
      <PageHeader title={`Order #${order.id}`} />

      <div className="order-details-page">

        {/* =====================================================
            ORDER STATUS
        ===================================================== */}

        <div className="details-card status-card">
          <div className="details-card-title">
            <FaBoxOpen />

            <h3>Order Tracking</h3>
          </div>

          <div className="tracking-status">
            <span
              className={`status-dot ${order.status
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            />

            <span>{order.status}</span>
          </div>

          <OrderTimeline status={order.status} />
        </div>

        {/* =====================================================
            PAYMENT
        ===================================================== */}

        <div className="details-card">
          <div className="details-card-title">
            <FaCreditCard />

            <h3>Payment</h3>
          </div>

          <div className="simple-info">
            <span>Payment Method</span>

            <strong>{order.payment_method}</strong>
          </div>

          <div className="simple-info">
            <span>Payment Status</span>

            <strong>Pending</strong>
          </div>
        </div>

        {/* =====================================================
            ADDRESS
        ===================================================== */}

        <div className="details-card">
          <div className="details-card-title">
            <FaMapMarkerAlt />

            <h3>Delivery Address</h3>
          </div>

          <div className="delivery-address">
            <h4>{order.address.full_name}</h4>

            <p>{order.address.phone}</p>

            <p>
              {order.address.house},{" "}
              {order.address.street}
            </p>

            <p>
              {order.address.city},{" "}
              {order.address.state}
            </p>

            <p>{order.address.pincode}</p>
          </div>
        </div>

        {/* =====================================================
            ITEMS
        ===================================================== */}

        <div className="details-card">
          <div className="details-card-title">
            <FaBoxOpen />

            <h3>Items</h3>
          </div>

          {order.items.map((item) => (
            <div className="item-row" key={item.id}>
              <div className="item-left">
                <img
                  src={`${BASE_URL}${item.product_image}`}
                  alt={item.product_name}
                  className="item-image"
                />

                <div className="item-info">
                  <h4>{item.product_name}</h4>

                  <p>
                    Qty: {item.quantity} × ₹
                    {item.price}
                  </p>
                </div>
              </div>

              <strong>
                ₹
                {(
                  Number(item.price) *
                  item.quantity
                ).toFixed(2)}
              </strong>
            </div>
          ))}

          <div className="order-total">
            <span>Total</span>

            <strong>
              ₹{Number(order.total_amount).toFixed(2)}
            </strong>
          </div>
        </div>

        {/* =====================================================
            ORDER DATE
        ===================================================== */}

        <div className="order-created">
          Order placed on{" "}
          {new Date(order.created_at).toLocaleString()}
        </div>

        {/* =====================================================
            CANCEL
        ===================================================== */}

        {canCancel && (
          <button
            className="cancel-order-btn"
            onClick={handleCancel}
            disabled={cancelling}
          >
            <FaTimes />

            {cancelling
              ? "Cancelling..."
              : "Cancel Order"}
          </button>
        )}
      </div>
    </>
  );
}

export default OrderDetails;