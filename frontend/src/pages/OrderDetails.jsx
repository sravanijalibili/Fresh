import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageHeader from "../components/PageHeader";

import { getOrderDetails, cancelOrder } from "../services/orderService";

import toast from "react-hot-toast";
import OrderTimeline from "../components/OrderTimeline";
import "../styles/orderdetails.css";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const data = await getOrderDetails(id);

      setOrder(data);
    } catch {
      toast.error("Unable to load order");
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await cancelOrder(id);

      toast.success("Order Cancelled");

      loadOrder();
    } catch {
      toast.error("Unable to cancel order");
    }
  };

  if (!order) return null;

  return (
    <>
      <PageHeader title={`Order #${order.id}`} />

      <div className="order-details-page">
        <div className="details-card">
          <h3>Order Status</h3>

          <OrderTimeline status={order.status} />
        </div>

        <div className="details-card">
          <h3>Payment</h3>

          <p>{order.payment_method}</p>
        </div>

        <div className="details-card">
          <h3>Delivery Address</h3>

          <p>{order.address.full_name}</p>

          <p>{order.address.phone}</p>

          <p>
            {order.address.house}, {order.address.street}
          </p>

          <p>
            {order.address.city}, {order.address.state}
          </p>

          <p>{order.address.pincode}</p>
        </div>

        <div className="details-card">
          <h3>Items</h3>

          {order.items.map((item) => (
            <div className="item-row" key={item.id}>
              <div className="item-left">
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="item-image"
                />

                <div>
                  <h4>{item.product_name}</h4>

                  <p>
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
              </div>

              <strong>₹{Number(item.price) * item.quantity}</strong>
            </div>
          ))}
        </div>

        {order.status !== "Delivered" && order.status !== "Cancelled" && (
          <button className="cancel-order-btn" onClick={handleCancel}>
            Cancel Order
          </button>
        )}
      </div>
    </>
  );
}

export default OrderDetails;
