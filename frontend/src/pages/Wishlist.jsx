import { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL } from "../services/api";
import PageHeader from "../components/PageHeader";
import { useCart } from "../context/CartContext";

import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

import "../styles/wishlist.css";

function Wishlist() {
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const data = await getWishlist();

      setWishlist(data);
    } catch (error) {
      console.error(error);

      toast.error("Unable to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (wishlistId) => {
    try {
      await removeFromWishlist(wishlistId);

      setWishlist((previous) =>
        previous.filter((item) => item.id !== wishlistId)
      );

      toast.success("Removed from wishlist");
    } catch (error) {
      console.error(error);

      toast.error("Unable to remove item");
    }
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: item.product,
      name: item.product_name,
      image: item.product_image,
      price: Number(item.price),
      quantity: 1,
    });

    toast.success("Added to cart");
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Wishlist" />

        <div className="wishlist-loading">
          Loading wishlist...
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Wishlist" />

      <div className="wishlist-page">
        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">
              <FaHeart />
            </div>

            <h2>Your Wishlist is Empty</h2>

            <p>
              Save your favourite products here and easily add
              them to your cart later.
            </p>

            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div className="wishlist-card" key={item.id}>
                <button
                  className="wishlist-remove"
                  onClick={() => handleRemove(item.id)}
                  aria-label="Remove from wishlist"
                >]
                  <FaTrash />
                </button>

                <img
                src={
                    item.product_image?.startsWith("http")
                      ? item.product_image
                      : `${BASE_URL}${item.product_image}`
                  }                  alt={item.product_name}
                  className="wishlist-image"
                />

                <div className="wishlist-details">
                  <h3>{item.product_name}</h3>

                  <p>{item.quantity}</p>

                  <h2>₹{item.price}</h2>

                  <button
                    className="wishlist-cart-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    <FaShoppingCart />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Wishlist;