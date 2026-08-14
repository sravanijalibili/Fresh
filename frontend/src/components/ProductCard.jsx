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
      // REMOVE
      if (wishlisted && wishlistId) {
        await removeFromWishlist(wishlistId);

        setWishlisted(false);
        setWishlistId(null);

        toast.success("Removed from wishlist");

        return;
      }

      // ADD
      const data = await addToWishlist(product.id);

      setWishlisted(true);

      setWishlistId(data.id);

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

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = (e) => {
    e.stopPropagation();

    addToCart(product);

    toast.success(`${product.name} added to cart`);
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="product-image">
        <img
          src={product.image}
          alt={product.name}
        />

        {/* Rating */}

        <span className="rating">
          ⭐ 4.8
        </span>

        {/* Discount */}

        <span className="discount">
          20% OFF
        </span>

        {/* Wishlist */}

        <button
          className={`wishlist ${
            wishlisted ? "wishlisted" : ""
          }`}
          onClick={handleWishlist}
          disabled={wishlistLoading}
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <FaHeart />
        </button>
      </div>

      <div className="product-body">
        <h3>{product.name}</h3>

        <p>{product.quantity}</p>

        <div className="price-row">
          <h2 className="product-price">
            ₹{product.price}
          </h2>

          <button
            className="add-btn"
            onClick={handleAddToCart}
          >
            <FaPlus />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;