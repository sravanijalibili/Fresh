import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaMinus, FaShoppingCart, FaHeart } from "react-icons/fa";

import { useCart } from "../context/CartContext";
import PageHeader from "../components/PageHeader";
import toast from "react-hot-toast";

import "../styles/productdetails.css";
import "../styles/reviews.css";
import {
  getProductReviews,
  getProductRating,
  getMyReview,
  createReview,
  updateReview,
  deleteReview,
} from "../services/reviewService";
import API from "../services/api";
import RelatedProducts from "../components/RelatedProducts";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

function ProductDetails() {
  const { productId } = useParams();

  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [wishlistItem, setWishlistItem] = useState(null);

  const [wishlistLoading, setWishlistLoading] = useState(false);

  // ============================================================
  // REVIEWS
  // ============================================================

  const [reviews, setReviews] = useState([]);

  const [ratingData, setRatingData] = useState({
    average_rating: 0,
    review_count: 0,
  });

  const [myReview, setMyReview] = useState(null);

  const [reviewRating, setReviewRating] = useState(5);

  const [reviewComment, setReviewComment] = useState("");

  const [reviewLoading, setReviewLoading] = useState(false);

  const [reviewFormOpen, setReviewFormOpen] = useState(false);

  const [editingReview, setEditingReview] = useState(false);

  // ============================================================
  // LOAD PRODUCT
  // ============================================================

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const response = await API.get(`productDetails/${productId}/`);

      setProduct(response.data);
    } catch (error) {
      console.error(error);

      toast.error("Unable to load product");
    }
  };

  // ============================================================
  // LOAD WISHLIST
  // ============================================================

  useEffect(() => {
    loadWishlist();
  }, [productId]);

  const loadWishlist = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      return;
    }

    try {
      const data = await getWishlist();

      const existingItem = data.find(
        (item) => String(item.product) === String(productId)
      );

      setWishlistItem(existingItem || null);
    } catch (error) {
      console.error("Wishlist loading error:", error);
    }
  };

  // ============================================================
  // LOAD REVIEWS
  // ============================================================

  useEffect(() => {
    if (!productId) {
      return;
    }

    loadReviews();
    loadRating();
    loadMyReview();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const data = await getProductReviews(productId);

      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Reviews loading error:", error);

      setReviews([]);
    }
  };

  const loadRating = async () => {
    try {
      const data = await getProductRating(productId);

      setRatingData({
        average_rating: Number(data.average_rating) || 0,
        review_count: Number(data.review_count) || 0,
      });
    } catch (error) {
      console.error("Rating loading error:", error);
    }
  };

  const loadMyReview = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      return;
    }

    try {
      const data = await getMyReview(productId);

      if (data && data.review) {
        setMyReview(data.review);

        setReviewRating(data.review.rating);

        setReviewComment(data.review.comment || "");
      } else if (data && data.id) {
        setMyReview(data);

        setReviewRating(data.rating);

        setReviewComment(data.comment || "");
      } else {
        setMyReview(null);
      }
    } catch (error) {
      console.error("My review loading error:", error);

      setMyReview(null);
    }
  };

  // ============================================================
  // TOGGLE WISHLIST
  // ============================================================

  const handleWishlist = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      toast("Please login to use Wishlist");

      navigate("/login");

      return;
    }

    if (wishlistLoading) {
      return;
    }

    setWishlistLoading(true);

    try {
      // --------------------------------------------------------
      // REMOVE
      // --------------------------------------------------------

      if (wishlistItem) {
        await removeFromWishlist(wishlistItem.id);

        setWishlistItem(null);

        toast.success("Removed from wishlist");

        return;
      }

      // --------------------------------------------------------
      // ADD
      // --------------------------------------------------------

      const newWishlistItem = await addToWishlist(product.id);

      setWishlistItem(newWishlistItem);

      toast.success("Added to wishlist");
    } catch (error) {
      console.error("Wishlist error:", error);

      toast.error(error.response?.data?.error || "Unable to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (!product) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  // ============================================================
  // SUBMIT REVIEW
  // ============================================================

  const handleSubmitReview = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      toast("Please login to write a review");

      navigate("/login");

      return;
    }

    if (!reviewRating) {
      toast.error("Please select a rating");

      return;
    }

    setReviewLoading(true);

    try {
      let response;

      if (editingReview) {
        response = await updateReview(productId, reviewRating, reviewComment);

        toast.success("Review updated successfully");
      } else {
        response = await createReview(productId, reviewRating, reviewComment);

        toast.success("Review submitted successfully");
      }

      setMyReview(response);

      setReviewFormOpen(false);

      setEditingReview(false);

      await loadReviews();

      await loadRating();
    } catch (error) {
      console.error("Review submission error:", error);

      toast.error(error.response?.data?.error || "Unable to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  // ============================================================
  // EDIT REVIEW
  // ============================================================

  const handleEditReview = () => {
    if (!myReview) {
      return;
    }

    setReviewRating(myReview.rating);

    setReviewComment(myReview.comment || "");

    setEditingReview(true);

    setReviewFormOpen(true);
  };

  // ============================================================
  // DELETE REVIEW
  // ============================================================

  const handleDeleteReview = async () => {
    if (!myReview) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete your review?"
    );

    if (!confirmed) {
      return;
    }

    setReviewLoading(true);

    try {
      await deleteReview(productId);

      setMyReview(null);

      setReviewRating(5);

      setReviewComment("");

      setReviewFormOpen(false);

      setEditingReview(false);

      toast.success("Review deleted successfully");

      await loadReviews();

      await loadRating();
    } catch (error) {
      console.error("Review deletion error:", error);

      toast.error(error.response?.data?.error || "Unable to delete review");
    } finally {
      setReviewLoading(false);
    }
  };

  // ============================================================
  // STAR DISPLAY
  // ============================================================

  const renderStars = (rating) => {
    const roundedRating = Math.round(Number(rating) || 0);

    return "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);
  };

  // ============================================================
  // STOCK STATUS
  // ============================================================

  const getStockStatus = () => {
    if (product.stock <= 0) {
      return {
        text: "Out of Stock",
        className: "out-of-stock",
      };
    }

    if (product.stock <= 5) {
      return {
        text: `Only ${product.stock} left`,
        className: "low-stock",
      };
    }

    return {
      text: "In Stock",
      className: "in-stock",
    };
  };

  const stockStatus = getStockStatus();

  // ============================================================
  // INCREASE QUANTITY
  // ============================================================

  const increaseQuantity = () => {
    if (quantity >= product.stock) {
      toast.error(`Only ${product.stock} unit(s) available.`);
      return;
    }

    setQuantity(quantity + 1);
  };

  // ============================================================
  // ADD TO CART
  // ============================================================

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("This product is currently out of stock.");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    toast.success(`${product.name} added to cart`);
  };

  // ============================================================
  // DISCOUNT
  // ============================================================

  const hasDiscount =
    Number(product.discount_percentage) > 0 &&
    Number(product.original_price) > Number(product.price);

  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      <PageHeader title="Product Details" />

      <div className="product-details">
        <div className="product-details-card">
          {/* ==================================================
              PRODUCT IMAGE
          ================================================== */}

          <div className="product-image-container">
            {hasDiscount && (
              <div className="discount-tag">
                {product.discount_percentage}% OFF
              </div>
            )}

            <button
              className={`wishlist-heart ${
                wishlistItem ? "wishlist-active" : ""
              }`}
              onClick={handleWishlist}
              disabled={wishlistLoading}
              aria-label={
                wishlistItem ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <FaHeart />
            </button>

            <img
              src={product.image}
              alt={product.name}
              className="product-main-image"
            />
          </div>

          {/* ==================================================
              PRODUCT INFORMATION
          ================================================== */}

          <div className="product-info">
            <div className="product-title-row">
              <h1>{product.name}</h1>

              <button
                className={`wishlist-title-button ${
                  wishlistItem ? "wishlist-active" : ""
                }`}
                onClick={handleWishlist}
                disabled={wishlistLoading}
                aria-label={
                  wishlistItem ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <FaHeart />
              </button>
            </div>

            <div className="product-meta">
              <div className="rating">
                ⭐{" "}
                {ratingData.review_count > 0
                  ? ratingData.average_rating.toFixed(1)
                  : "No ratings"}
              </div>
              <div className={`stock-badge ${stockStatus.className}`}>
                🟢 {stockStatus.text}
              </div>{" "}
            </div>

            {/* ==================================================
                PRICE
            ================================================== */}

            <div className="price-section">
              <div className="product-price">₹{product.price}</div>

              {hasDiscount && (
                <div className="original-price">₹{product.original_price}</div>
              )}
            </div>

            <div className="product-quantity">{product.quantity}</div>

            {/* ==================================================
                DELIVERY
            ================================================== */}

            <div className="delivery-card">
              <h4>⚡ Delivery</h4>

              <p>
                Delivery within
                <strong> 10 Minutes</strong>
              </p>
            </div>

            {/* ==================================================
                OFFER
            ================================================== */}

            {hasDiscount && (
              <div className="offer-badge">
                🔥 {product.discount_percentage}% OFF on this product
              </div>
            )}

            {/* ==================================================
                ABOUT PRODUCT
            ================================================== */}

            <div className="about-product">
              <h3>About this Product</h3>

              <p>
                Fresh quality {product.name.toLowerCase()} sourced directly from
                trusted farms. Carefully packed to retain freshness.
              </p>
            </div>

            {/* ==================================================
                QUANTITY
            ================================================== */}

            <div className="quantity-selector">
              <button
                onClick={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                  }
                }}
                disabled={quantity <= 1}
              >
                <FaMinus />
              </button>

              <span>{quantity}</span>

              <button
                onClick={increaseQuantity}
                disabled={product.stock <= 0 || quantity >= product.stock}
              >
                <FaPlus />
              </button>
            </div>

            {/* ==================================================
                ADD TO CART
            ================================================== */}

            <button
              className="cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <FaShoppingCart />

              {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
        <RelatedProducts productId={productId} />

        {/* ==================================================
            REVIEWS
        ================================================== */}

        <section className="reviews-section">
          <div className="reviews-header">
            <div>
              <h2>Customer Reviews</h2>

              <p>See what customers think about this product.</p>
            </div>

            <div className="rating-summary">
              <div className="average-rating">
                {ratingData.average_rating.toFixed(1)}
              </div>

              <div className="rating-stars">
                {renderStars(ratingData.average_rating)}
              </div>

              <div className="review-count">
                {ratingData.review_count}{" "}
                {ratingData.review_count === 1 ? "review" : "reviews"}
              </div>
            </div>
          </div>

          {/* ==================================================
              MY REVIEW
          ================================================== */}

          {myReview && !reviewFormOpen && (
            <div className="my-review-card">
              <div className="my-review-header">
                <div>
                  <h3>Your Review</h3>

                  <div className="review-stars">
                    {renderStars(myReview.rating)}
                  </div>
                </div>

                <div className="review-actions">
                  <button
                    type="button"
                    onClick={handleEditReview}
                    disabled={reviewLoading}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    disabled={reviewLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {myReview.comment && (
                <p className="review-comment">{myReview.comment}</p>
              )}
            </div>
          )}

          {/* ==================================================
              WRITE / EDIT REVIEW
          ================================================== */}

          {reviewFormOpen && (
            <div className="review-form">
              <h3>{editingReview ? "Edit Your Review" : "Write a Review"}</h3>

              <div className="rating-selector">
                <p>Your rating</p>

                <div className="rating-buttons">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={star <= reviewRating ? "selected" : ""}
                      onClick={() => setReviewRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                maxLength={1000}
              />

              <div className="review-form-actions">
                <button
                  type="button"
                  className="cancel-review-btn"
                  onClick={() => {
                    setReviewFormOpen(false);
                    setEditingReview(false);
                  }}
                  disabled={reviewLoading}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="submit-review-btn"
                  onClick={handleSubmitReview}
                  disabled={reviewLoading}
                >
                  {reviewLoading
                    ? "Submitting..."
                    : editingReview
                      ? "Update Review"
                      : "Submit Review"}
                </button>
              </div>
            </div>
          )}

          {/* ==================================================
              WRITE REVIEW BUTTON
          ================================================== */}

          {!myReview && !reviewFormOpen && (
            <button
              type="button"
              className="write-review-btn"
              onClick={() => {
                const token = localStorage.getItem("access");

                if (!token) {
                  toast("Please login to write a review");

                  navigate("/login");

                  return;
                }

                setReviewFormOpen(true);
              }}
            >
              ⭐ Write a Review
            </button>
          )}

          {/* ==================================================
              ALL REVIEWS
          ================================================== */}

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <div className="no-reviews">
                <div className="no-reviews-icon">⭐</div>

                <h3>No reviews yet</h3>

                <p>Be the first customer to review this product.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <div className="review-card-header">
                    <div>
                      <h3>{review.user_name}</h3>

                      <div className="review-stars">
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    <span className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="review-comment">{review.comment}</p>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default ProductDetails;
