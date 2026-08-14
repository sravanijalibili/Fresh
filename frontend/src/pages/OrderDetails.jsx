import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaBox,
  FaTimesCircle,
  FaSyncAlt,
} from "react-icons/fa";
import {
  getMyReview,
  createReview,
  updateReview,
  deleteReview,
} from "../services/reviewService";
import PageHeader from "../components/PageHeader";

import { getOrderDetails, cancelOrder } from "../services/orderService";

import { BASE_URL } from "../services/api";

import toast from "react-hot-toast";

import OrderTimeline from "../components/OrderTimeline";

import "../styles/orderdetails.css";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const [reviews, setReviews] = useState({});
  const [reviewProduct, setReviewProduct] = useState(null);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);
  const loadOrder = async () => {
    try {
      setLoading(true);

      const data = await getOrderDetails(id);

      setOrder(data);

      if (data.status === "Delivered") {
        await loadReviews(data.items);
      }
    } catch (error) {
      console.error(error);

      toast.error("Unable to load order");
    } finally {
      setLoading(false);
    }
  };

  const openReview = (item) => {
    const existingReview = reviews[item.product];

    setReviewProduct(item);

    if (existingReview) {
      setReviewRating(existingReview.rating);
      setReviewComment(existingReview.comment || "");
    } else {
      setReviewRating(5);
      setReviewComment("");
    }
  };

  const loadReviews = async (items) => {
    if (!items || items.length === 0) {
      return;
    }

    const reviewMap = {};

    for (const item of items) {
      try {
        const data = await getMyReview(item.product);

        if (data && data.review) {
          reviewMap[item.product] = data.review;
        } else if (data && data.id) {
          reviewMap[item.product] = data;
        }
      } catch (error) {
        console.error(
          `Unable to load review for product ${item.product}:`,
          error
        );
      }
    }

    setReviews(reviewMap);
  };

  const handleSubmitReview = async () => {
    if (!reviewProduct) {
      return;
    }

    setReviewLoading(true);

    try {
      const existingReview = reviews[reviewProduct.product];

      let response;

      if (existingReview) {
        response = await updateReview(
          reviewProduct.product,
          reviewRating,
          reviewComment
        );

        toast.success("Review updated successfully");
      } else {
        response = await createReview(
          reviewProduct.product,
          reviewRating,
          reviewComment
        );

        toast.success("Review submitted successfully");
      }

      setReviews((previous) => ({
        ...previous,
        [reviewProduct.product]: response,
      }));

      setReviewProduct(null);
      setReviewRating(5);
      setReviewComment("");
    } catch (error) {
      console.error("Review submission error:", error);

      toast.error(error.response?.data?.error || "Unable to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!reviewProduct) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    setReviewLoading(true);

    try {
      await deleteReview(reviewProduct.product);

      setReviews((previous) => {
        const updated = { ...previous };

        delete updated[reviewProduct.product];

        return updated;
      });

      setReviewProduct(null);

      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Review deletion error:", error);

      toast.error(error.response?.data?.error || "Unable to delete review");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);

      await cancelOrder(id);

      toast.success("Order cancelled successfully");

      await loadOrder();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.error || "Unable to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader title={`Order #${id}`} />

        <div className="order-loading">
          <FaSyncAlt className="loading-icon" />

          <p>Loading order...</p>
        </div>
      </>
    );
  }

  if (!order) {
    return null;
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const delivery = subtotal >= 199 ? 0 : 30;

  const platformFee = 5;

  const paymentMethod =
    order.payment_method === "COD"
      ? "Cash on Delivery"
      : order.payment_method === "UPI"
        ? "UPI"
        : order.payment_method === "CARD"
          ? "Credit / Debit Card"
          : order.payment_method;

  const canCancel =
    order.status !== "Delivered" && order.status !== "Cancelled";

  return (
    <>
      <PageHeader title={`Order #${order.id}`} />

      <div className="order-details-page">
        {/* =========================================
            ORDER HEADER
        ========================================= */}

        <div className="order-status-card">
          <div className="order-status-content">
            <span className="order-label">ORDER #{order.id}</span>

            <h2>{order.status}</h2>

            <p>Placed on {new Date(order.created_at).toLocaleString()}</p>
          </div>

          <div className="order-status-icon">
            <FaBox />
          </div>
        </div>

        <div className="details-card delivery-estimate-card">
          <div className="delivery-estimate-icon">🚴</div>

          <div>
            <h3>Estimated Delivery</h3>
            <strong>Within 10 Minutes</strong>
            <p>Your order is being prepared.</p>
          </div>
        </div>

        <div className="details-card">
          <h3>Price Details</h3>

          <div className="price-row">
            <span>Items Total</span>

            <strong>
              ₹
              {order.items.reduce(
                (sum, item) => sum + Number(item.price) * item.quantity,
                0
              )}
            </strong>
          </div>

          <div className="price-row">
            <span>Delivery</span>

            <strong>FREE</strong>
          </div>

          <div className="price-row">
            <span>Platform Fee</span>

            <strong>₹5</strong>
          </div>

          <hr />

          <div className="price-row total-row">
            <span>Total</span>

            <strong>₹{order.total_amount}</strong>
          </div>
        </div>

        {/* =========================================
            ORDER TRACKING
        ========================================= */}

        <div className="details-card">
          <h3 className="section-title">
            <FaBox />
            Order Tracking
          </h3>

          <OrderTimeline status={order.status} />
        </div>

        {/* =========================================
            PAYMENT
        ========================================= */}

        <div className="details-card">
          <h3 className="section-title">
            <FaCreditCard />
            Payment
          </h3>

          <div className="info-row">
            <span>Payment Method</span>

            <strong>{paymentMethod}</strong>
          </div>

          <div className="info-row">
            <span>Payment Status</span>

            <strong className="payment-status">
              {order.payment_method === "COD"
                ? "Pay on Delivery"
                : "Payment Selected"}
            </strong>
          </div>
        </div>

        {/* =========================================
            DELIVERY ADDRESS
        ========================================= */}

        <div className="details-card">
          <h3 className="section-title">
            <FaMapMarkerAlt />
            Delivery Address
          </h3>

          <div className="address-details">
            <strong>{order.address.full_name}</strong>

            <p>📞 {order.address.phone}</p>

            <p>
              {order.address.house}, {order.address.street}
            </p>

            <p>
              {order.address.city}, {order.address.state}
            </p>

            <p>{order.address.pincode}</p>
          </div>
        </div>

        {/* =========================================
            ORDER ITEMS
        ========================================= */}

        <div className="details-card">
          <h3 className="section-title">
            <FaBox />
            Order Items
          </h3>

          {order.items.map((item) => {
            const existingReview = reviews[item.product];

            return (
              <div className="item-row" key={item.id}>
                <div className="item-left">
                  <img
                    src={
                      item.product_image?.startsWith("http")
                        ? item.product_image
                        : `${BASE_URL}${item.product_image}`
                    }
                    alt={item.product_name}
                    className="item-image"
                  />

                  <div className="item-info">
                    <h4>{item.product_name}</h4>

                    <p>
                      ₹{item.price} × {item.quantity}
                    </p>

                    {/* =========================================
              REVIEW
          ========================================= */}

                    {order.status === "Delivered" && (
                      <div className="item-review">
                        {existingReview ? (
                          <button
                            type="button"
                            className="reviewed-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              openReview(item);
                            }}
                          >
                            ✓ Reviewed
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="rate-review-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              openReview(item);
                            }}
                          >
                            ⭐ Rate & Review
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <strong className="item-total">
                  ₹{(Number(item.price) * item.quantity).toFixed(2)}
                </strong>
              </div>
            );
          })}
        </div>

        {/* =========================================
            PRICE DETAILS
        ========================================= */}

        <div className="details-card">
          <h3 className="section-title">Price Details</h3>

          <div className="info-row">
            <span>Subtotal</span>

            <strong>₹{subtotal.toFixed(2)}</strong>
          </div>

          <div className="info-row">
            <span>Delivery</span>

            <strong>{delivery === 0 ? "FREE" : `₹${delivery}`}</strong>
          </div>

          <div className="info-row">
            <span>Platform Fee</span>

            <strong>₹{platformFee}</strong>
          </div>

          <hr />

          <div className="info-row grand-total">
            <span>Total</span>

            <strong>₹{order.total_amount}</strong>
          </div>
        </div>

        {/* =========================================
            CANCEL ORDER
        ========================================= */}

        {canCancel && (
          <button
            className="cancel-order-btn"
            onClick={handleCancel}
            disabled={cancelling}
          >
            <FaTimesCircle />

            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}

        {reviewProduct && (
          <div
            className="review-modal-overlay"
            onClick={() => {
              if (!reviewLoading) {
                setReviewProduct(null);
              }
            }}
          >
            <div
              className="review-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <h3>
                {reviews[reviewProduct.product]
                  ? "Edit Your Review"
                  : "Rate & Review"}
              </h3>

              <p className="review-product-name">
                {reviewProduct.product_name}
              </p>

              <div className="review-rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={star <= reviewRating ? "selected" : ""}
                    onClick={() => setReviewRating(star)}
                    disabled={reviewLoading}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                maxLength={1000}
                disabled={reviewLoading}
              />

              <div className="review-modal-actions">
                <button
                  type="button"
                  className="review-cancel-btn"
                  onClick={() => setReviewProduct(null)}
                  disabled={reviewLoading}
                >
                  Cancel
                </button>

                {reviews[reviewProduct.product] && (
                  <button
                    type="button"
                    className="review-delete-btn"
                    onClick={handleDeleteReview}
                    disabled={reviewLoading}
                  >
                    Delete
                  </button>
                )}

                <button
                  type="button"
                  className="review-submit-btn"
                  onClick={handleSubmitReview}
                  disabled={reviewLoading}
                >
                  {reviewLoading
                    ? "Saving..."
                    : reviews[reviewProduct.product]
                      ? "Update Review"
                      : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default OrderDetails;
