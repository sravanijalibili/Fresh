import { useEffect, useState } from "react";
import { FaHeart, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

import "../styles/productcard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // =========================================================
  // CHECK WHETHER PRODUCT IS ALREADY IN WISHLIST
  // =========================================================

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const wishlist = await getWishlist();

        const existingItem = wishlist.find(
          (item) => Number(item.product) === Number(product.id)
        );

        if (existingItem) {
          setWishlisted(true);
          setWishlistId(existingItem.id);
        } else {
          setWishlisted(false);
          setWishlistId(null);
        }
      } catch (error) {
        console.error("Wishlist check failed:", error);
      }
    };

    checkWishlist();
  }, [product.id]);

  // =========================================================
  // TOGGLE WISHLIST
  // =========================================================

  const handleWishlist = async (e) => {
    e.stopPropagation();

    if (wishlistLoading) {
      return;
    }

    setWishlistLoading(true);

    try {
      if (wishlisted && wishlistId) {
        await removeFromWishlist(wishlistId);

        setWishlisted(false);
        setWishlistId(null);

        toast.success("Removed from wishlist");

        return;
      }

      const data = await addToWishlist(product.id);

      setWishlisted(true);
      setWishlistId(data.id);

      toast.success("Added to wishlist");
    } catch (error) {
      console.error("Wishlist error:", error);

      toast.error(error.response?.data?.error || "Unable to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (product.stock <= 0) {
      toast.error("This product is currently out of stock.");

      return;
    }

    addToCart(product);

    toast.success(`${product.name} added to cart`);
  };

  // =========================================================
  // STOCK STATUS
  // =========================================================

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

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {/* Rating */}

        {Number(product.review_count || 0) > 0 && (
          <div className="product-rating">
            ⭐ {Number(product.average_rating || 0).toFixed(1)}
            <span> ({product.review_count})</span>
          </div>
        )}
        {/* Discount */}

        {product.discount_percentage > 0 && (
          <span className="discount">{product.discount_percentage}% OFF</span>
        )}

        {/* Wishlist */}

        <button
          className={`wishlist ${wishlisted ? "wishlisted" : ""}`}
          onClick={handleWishlist}
          disabled={wishlistLoading}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FaHeart />
        </button>
      </div>

      <div className="product-body">
        <h3>{product.name}</h3>

        <p>{product.quantity}</p>

        {/* Stock */}

        <div className={`stock-status ${stockStatus.className}`}>
          {stockStatus.text}
        </div>

        <div className="price-row">
          <h2 className="product-price">₹{product.price}</h2>

          <button
            className="add-btn"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <FaPlus />

            {product.stock <= 0 ? "Unavailable" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
