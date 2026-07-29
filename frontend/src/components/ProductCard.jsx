import { FaHeart, FaPlus } from "react-icons/fa";
import "../styles/productcard.css";

function ProductCard({ product }) {
  return (
    <div className="product-card">

      <div className="product-image">

        <span className="rating">
          ⭐ 4.8
        </span>

        <button className="wishlist">
          <FaHeart />
        </button>

        <img
          src={product.image}
          alt={product.name}
        />

      </div>

      <div className="product-body">

        <h3>{product.name}</h3>

        <p>{product.quantity}</p>

        <div className="price-row">

          <h2>₹{product.price}</h2>

          <button className="add-btn">

            <FaPlus />

            Add

          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;