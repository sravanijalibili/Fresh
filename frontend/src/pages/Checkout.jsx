import { useCart } from "../context/CartContext";
import "../styles/checkout.css";

function Checkout() {

    const { cartItems } = useCart();

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (

        <div className="checkout-page">

            <h1>Checkout</h1>

            <div className="checkout-container">

                <div className="address-card">

                    <h2>Delivery Address</h2>

                    <input
                        type="text"
                        placeholder="Full Name"
                    />

                    <input
                        type="text"
                        placeholder="Mobile Number"
                    />

                    <textarea
                        rows="4"
                        placeholder="Delivery Address"
                    />

                </div>

                <div className="order-summary">

                    <h2>Order Summary</h2>

                    {

                        cartItems.map(item => (

                            <div
                                key={item.id}
                                className="summary-row"
                            >

                                <span>

                                    {item.name} × {item.quantity}

                                </span>

                                <strong>

                                    ₹{item.price * item.quantity}

                                </strong>

                            </div>

                        ))

                    }

                    <hr />

                    <div className="summary-row">

                        <span>Subtotal</span>

                        <strong>₹{total}</strong>

                    </div>

                    <div className="summary-row">

                        <span>Delivery</span>

                        <strong>FREE</strong>

                    </div>

                    <div className="summary-row total">

                        <span>Total</span>

                        <strong>₹{total}</strong>

                    </div>

                    <button className="place-order">

                        Place Order

                    </button>

                </div>

            </div>

        </div>

    );

}

export default Checkout;