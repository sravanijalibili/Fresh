import { FaHeart, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";
import "../styles/productcard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const { addToCart } = useCart();

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="product-image">
        <img src={product.image} alt={product.name} />

        {/* Rating */}

        <span className="rating">⭐ 4.8</span>

        {/* Discount */}

        <span className="discount">20% OFF</span>

        {/* Wishlist */}

        <button
          className="wishlist"
          onClick={(e) => {
            e.stopPropagation();

            toast.success("Added to wishlist");
          }}
        >
          <FaHeart />
        </button>
      </div>

      <div className="product-body">
        <h3>{product.name}</h3>

        <p>{product.quantity}</p>

        <div className="price-row">
          <h2 className="product-price">₹{product.price}</h2>

          <button
            className="add-btn"
            onClick={(e) => {
              e.stopPropagation();

              addToCart(product);

              toast.success(`${product.name} added to cart`);
            }}
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
