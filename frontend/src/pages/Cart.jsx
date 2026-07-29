import {
  FaPlus,
  FaMinus,
  FaTrash
} from "react-icons/fa";

import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

function Cart() {

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useCart();

  const navigate = useNavigate();
  const total = cartItems.reduce(

    (sum, item) =>

      sum + item.price * item.quantity,

    0

  );

  return (

    <div className="cart-page">

      <h1>

        🛒 My Cart

      </h1>

      {

        cartItems.length === 0 ?

          <div className="empty-cart">

            <h2>Your Cart is Empty</h2>

            <p>

              Add some fresh products.

            </p>

          </div>

          :

          <>

            {

              cartItems.map(item => (

                <div

                  className="cart-item"

                  key={item.id}

                >

                  <img

                    src={item.image}

                    alt={item.name}

                  />

                  <div className="cart-details">

                    <h3>{item.name}</h3>

                    <p>{item.quantity} Pack</p>

                    <h2>

                      ₹{item.price}

                    </h2>

                  </div>

                  <div className="cart-actions">

                    <div className="qty-box">

                      <button

                        onClick={() =>
                          decreaseQuantity(item.id)
                        }

                      >

                        <FaMinus />

                      </button>

                      <span>

                        {item.quantity}

                      </span>

                      <button

                        onClick={() =>
                          increaseQuantity(item.id)
                        }

                      >

                        <FaPlus />

                      </button>

                    </div>

                    <button

                      className="remove-btn"

                      onClick={() =>
                        removeFromCart(item.id)
                      }

                    >

                      <FaTrash />

                    </button>

                  </div>

                </div>

              ))

            }

            <div className="cart-summary">

              <div>

                <span>

                  Subtotal

                </span>

                <strong>

                  ₹{total}

                </strong>

              </div>

              <div>

                <span>

                  Delivery

                </span>

                <strong>

                  FREE

                </strong>

              </div>

              <hr />

              <div>

                <span>

                  Total

                </span>

                <strong>

                  ₹{total}

                </strong>

              </div>

                <button

                    className="checkout-btn"

                    onClick={() => navigate("/checkout")}

                >

                    Proceed to Checkout

                </button>

            </div>

          </>

      }

    </div>

  );

}

export default Cart;