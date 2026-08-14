import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";

import { useCart } from "../context/CartContext";
import PageHeader from "../components/PageHeader";
import toast from "react-hot-toast";

import "../styles/productdetails.css";

import API from "../services/api";

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

    // User is not logged in
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

      toast.error(
        error.response?.data?.error ||
          "Unable to update wishlist"
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (!product) {
    return (
      <h2 style={{ textAlign: "center" }}>
        Loading...
      </h2>
    );
  }

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
            <div className="discount-tag">
              10% OFF
            </div>

            <button
              className={`wishlist-heart ${
                wishlistItem ? "wishlist-active" : ""
              }`}
              onClick={handleWishlist}
              disabled={wishlistLoading}
              aria-label={
                wishlistItem
                  ? "Remove from wishlist"
                  : "Add to wishlist"
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
                  wishlistItem
                    ? "wishlist-active"
                    : ""
                }`}
                onClick={handleWishlist}
                disabled={wishlistLoading}
                aria-label={
                  wishlistItem
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <FaHeart />
              </button>
            </div>

            <div className="product-meta">
              <div className="rating">
                ⭐ 4.8
              </div>

              <div className="stock-badge">
                🟢 In Stock
              </div>
            </div>

            <div className="price-section">

              <div className="product-price">
                ₹{product.price}
              </div>

              <div className="original-price">
                ₹{Math.round(product.price * 1.1)}
              </div>

            </div>

            <div className="product-quantity">
              {product.quantity}
            </div>

            <div className="delivery-card">
              <h4>⚡ Delivery</h4>

              <p>
                Delivery within
                <strong> 10 Minutes</strong>
              </p>
            </div>

            <div className="offer-badge">
              🔥 10% OFF on this product
            </div>

            <div className="about-product">

              <h3>
                About this Product
              </h3>

              <p>
                Fresh quality{" "}
                {product.name.toLowerCase()}{" "}
                sourced directly from trusted farms.
                Carefully packed to retain freshness.
              </p>

            </div>

            {/* ==================================================
                QUANTITY
            ================================================== */}

            <div className="quantity-selector">

              <button
                onClick={() =>
                  quantity > 1 &&
                  setQuantity(quantity - 1)
                }
              >
                <FaMinus />
              </button>

              <span>
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity(quantity + 1)
                }
              >
                <FaPlus />
              </button>

            </div>

            {/* ==================================================
                ADD TO CART
            ================================================== */}

            <button
              className="cart-btn"
              onClick={() => {

                for (let i = 0; i < quantity; i++) {
                  addToCart(product);
                }

                toast.success(
                  `${product.name} added to cart`
                );

              }}
            >
              <FaShoppingCart />

              Add to Cart
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
