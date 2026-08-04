import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import BottomNav from "../components/BottomNav";
import { getAddresses } from "../services/addressService";
import { placeOrder as placeOrderAPI } from "../services/orderService";
import "../styles/checkout.css";

function Checkout() {
  const { cartItems, clearCart } = useCart();

  const navigate = useNavigate();

  const [payment, setPayment] = useState("cod");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();

      setAddresses(data);

      const defaultAddress = data.find((a) => a.is_default);

      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    } catch {
      toast.error("Unable to load addresses");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const delivery = subtotal >= 199 ? 0 : 30;

  const platformFee = 5;

  const total = subtotal + delivery + platformFee;

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address");

      return;
    }

    try {
      const payload = {
        address: selectedAddress,

        payment_method: payment.toUpperCase(),

        items: cartItems.map((item) => ({
          product: item.id,

          quantity: item.quantity,
        })),
      };

      await placeOrderAPI(payload);

      clearCart();

      toast.success("Order placed successfully");

      navigate("/order-success");
    } catch {
      toast.error("Unable to place order");
    }
  };

  return (
    <>
      <PageHeader title="Checkout" />

      <div className="checkout-page">
        {/* Delivery Address */}

        <div className="checkout-card">
          <h3>Delivery Address</h3>

          {addresses.map((address) => (
            <div
              key={address.id}
              className={`saved-address ${
                selectedAddress === address.id ? "selected-address" : ""
              }`}
              onClick={() => setSelectedAddress(address.id)}
            >
              <h4>{address.full_name}</h4>

              <p>{address.phone}</p>

              <p>
                {address.house},{address.street}
              </p>

              <p>
                {address.city},{address.state}
              </p>

              <p>{address.pincode}</p>
            </div>
          ))}
        </div>

        {/* Order Summary */}

        <div className="checkout-card">
          <h3>Order Summary</h3>

          {cartItems.map((item) => (
            <div key={item.id} className="summary-row">
              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}

          <hr />

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{subtotal}</strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <strong>{delivery === 0 ? "FREE" : `₹${delivery}`}</strong>
          </div>

          <div className="summary-row">
            <span>Platform Fee</span>
            <strong>₹{platformFee}</strong>
          </div>

          <hr />

          <div className="summary-row total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>
        </div>

        {/* Payment */}

        <div className="checkout-card">
          <h3>Payment Method</h3>

          <label>
            <input
              type="radio"
              checked={payment === "cod"}
              onChange={() => setPayment("cod")}
            />
            Cash on Delivery
          </label>

          <label>
            <input
              type="radio"
              checked={payment === "upi"}
              onChange={() => setPayment("upi")}
            />
            UPI
          </label>

          <label>
            <input
              type="radio"
              checked={payment === "card"}
              onChange={() => setPayment("card")}
            />
            Credit / Debit Card
          </label>
        </div>
      </div>

      {/* Bottom Bar */}

      <div className="place-order-bar">
        <div className="place-order-content">
          <div>
            <small>Total Payable</small>

            <h2>₹{total}</h2>
          </div>

          <button className="place-order" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}

export default Checkout;
