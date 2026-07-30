import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import BottomNav from "../components/BottomNav";
import "../styles/cart.css";

function Cart() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCart();

  const navigate = useNavigate();
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const deliveryCharge = subtotal >= 199 ? 0 : 30;

  const grandTotal = subtotal + deliveryCharge;

  return (
    <>
      <PageHeader title="My Cart" />
      <div className="cart-page">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              width="150"
              alt="empty"
            />

            <h2>Your Cart is Empty</h2>

            <p>Looks like you haven't added anything yet.</p>

            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-details">
                  <h3>{item.name}</h3>

                  <p>{item.quantity || "1 Unit"}</p>
                  <h2>₹{item.price}</h2>
                </div>

                <div className="cart-actions">
                  <div className="qty-box">
                    <button onClick={() => decreaseQuantity(item.id)}>
                      <FaMinus />
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQuantity(item.id)}>
                      <FaPlus />
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-summary">
              <div>
                <span>Subtotal</span>

                <strong>₹{subtotal}</strong>
              </div>

              <div>
                <span>Delivery</span>
                <strong>
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </strong>{" "}
              </div>

              <hr />

              <div>
                <span>Total</span>

                <strong>₹{grandTotal}</strong>
              </div>
            </div>

            <div className="checkout-bar">
              <div className="checkout-content">
                <div className="checkout-total">
                  <h3>Total</h3>

                  <h2>₹{grandTotal}</h2>
                </div>

                <button
                  className="checkout-btn"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Cart;
