import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import PageHeader from "../components/PageHeader";
import toast from "react-hot-toast";
import "../styles/productdetails.css";

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get(
        `https://fresh-backend-1007.onrender.com/api/productDetails/${productId}/`,
      )
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [productId]);

  if (!product) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <>
      <PageHeader title="Product Details" />
      <div className="product-details">
        <div className="product-details-card">
          <div className="product-image-container">
            <div className="discount-tag">10% OFF</div>

            <img
              src={product.image}
              alt={product.name}
              className="product-main-image"
            />
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>

            <div className="product-meta">
              <div className="rating">⭐ 4.8</div>

              <div className="stock-badge">🟢 In Stock</div>
            </div>

            <div className="price-section">
              <div className="product-price">₹{product.price}</div>

              <div className="original-price">
                ₹{Math.round(product.price * 1.1)}
              </div>
            </div>

            <div className="product-quantity">{product.quantity}</div>

            <div className="delivery-card">
              <h4>⚡ Delivery</h4>

              <p>
                Delivery within
                <strong> 10 Minutes</strong>
              </p>
            </div>

            <div className="offer-badge">🔥 10% OFF on this product</div>

            <div className="about-product">
              <h3>About this Product</h3>

              <p>
                Fresh quality {product.name.toLowerCase()}
                sourced directly from trusted farms. Carefully packed to retain
                freshness.
              </p>
            </div>
            <div className="quantity-selector">
              <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
                <FaMinus />
              </button>

              <span>{quantity}</span>

              <button onClick={() => setQuantity(quantity + 1)}>
                <FaPlus />
              </button>
            </div>

            <button
              className="cart-btn"
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart(product);
                }

                toast.success(`${product.name} added to cart`);
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
