import { FaHeart, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
        <span className="rating">⭐ 4.8</span>

        <button className="wishlist" onClick={(e) => e.stopPropagation()}>
          <FaHeart />
        </button>

        <img src={product.image} alt={product.name} />
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
