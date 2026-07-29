import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import "../styles/checkout.css";

function Checkout() {
  const { cartItems, clearCart } = useCart();

  const navigate = useNavigate();

  const [payment, setPayment] = useState("cod");

  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const savedAddress = localStorage.getItem("userAddress");

    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    }
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const delivery = subtotal >= 199 ? 0 : 30;

  const platformFee = 5;

  const total = subtotal + delivery + platformFee;

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = () => {
    localStorage.setItem("userAddress", JSON.stringify(address));

    toast.success("Address Saved");
  };

  const placeOrder = () => {
    if (
      !address.fullName ||
      !address.mobile ||
      !address.address ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      console.log("Validation Failed");
      toast.error("Please complete the delivery address");
      return;
    }

    localStorage.setItem("userAddress", JSON.stringify(address));

    toast.success("Order Placed Successfully");

    navigate("/order-success");
  };

  return (
    <>
      <PageHeader title="Checkout" />

      <div className="checkout-page">
        {/* Delivery Address */}

        <div className="checkout-card">
          <h3>Delivery Address</h3>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={address.fullName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={address.mobile}
            onChange={handleChange}
          />

          <textarea
            rows="3"
            name="address"
            placeholder="House No, Street, Area"
            value={address.address}
            onChange={handleChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleChange}
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={address.state}
            onChange={handleChange}
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={address.pincode}
            onChange={handleChange}
          />

          <button className="save-address" onClick={saveAddress}>
            Save Address
          </button>
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
