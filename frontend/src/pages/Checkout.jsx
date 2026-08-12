import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../components/PageHeader";
import BottomNav from "../components/BottomNav";

import { getAddresses, addAddress } from "../services/addressService";

import { placeOrder as placeOrderAPI } from "../services/orderService";

import "../styles/checkout.css";

function Checkout() {
  const { cartItems, clearCart } = useCart();

  const navigate = useNavigate();

  const [payment, setPayment] = useState("cod");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [savingAddress, setSavingAddress] = useState(false);

  const [addressForm, setAddressForm] = useState({
    full_name: "",
    phone: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });

  // ============================================================
  // LOAD ADDRESSES
  // ============================================================

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();

      setAddresses(data);

      const defaultAddress = data.find((address) => address.is_default);

      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else if (data.length > 0) {
        setSelectedAddress(data[0].id);
      }
    } catch (error) {
      console.error(error);

      toast.error("Unable to load addresses");
    }
  };

  // ============================================================
  // ADDRESS FORM CHANGE
  // ============================================================

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;

    setAddressForm({
      ...addressForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ============================================================
  // ADD ADDRESS
  // ============================================================

  const handleAddAddress = async (e) => {
    e.preventDefault();

    setSavingAddress(true);

    try {
      const newAddress = await addAddress(addressForm);

      // Add new address to the list
      setAddresses((previous) => [...previous, newAddress]);

      // Automatically select the newly added address
      setSelectedAddress(newAddress.id);

      // Close form
      setShowAddressForm(false);

      // Clear form
      setAddressForm({
        full_name: "",
        phone: "",
        house: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        is_default: false,
      });

      toast.success("Address added successfully");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.error || "Unable to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  // ============================================================
  // TOTAL
  // ============================================================

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = subtotal >= 199 ? 0 : 30;

  const platformFee = 5;

  const total = subtotal + delivery + platformFee;

  // ============================================================
  // PLACE ORDER
  // ============================================================

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please add or select a delivery address");

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
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.error || "Unable to place order");
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      <PageHeader title="Checkout" />

      <div className="checkout-page">
        {/* =====================================================
            DELIVERY ADDRESS
        ===================================================== */}

        <div className="checkout-card">
          <div className="checkout-section-header">
            <h3>Delivery Address</h3>

            {!showAddressForm && (
              <button
                className="add-address-btn"
                onClick={() => setShowAddressForm(true)}
              >
                + Add New Address
              </button>
            )}
          </div>

          {/* =================================================
              NO ADDRESS
          ================================================= */}

          {addresses.length === 0 && !showAddressForm && (
            <div className="no-address">
              <div className="no-address-icon">📍</div>

              <h4>No delivery address saved</h4>

              <p>Add an address to continue with your order.</p>

              <button
                className="add-first-address"
                onClick={() => setShowAddressForm(true)}
              >
                + Add Delivery Address
              </button>
            </div>
          )}

          {/* =================================================
              SAVED ADDRESSES
          ================================================= */}

          {addresses.length > 0 &&
            addresses.map((address) => (
              <div
                key={address.id}
                className={`saved-address ${
                  selectedAddress === address.id ? "selected-address" : ""
                }`}
                onClick={() => setSelectedAddress(address.id)}
              >
                <div className="address-card-top">
                  <h4>{address.full_name}</h4>

                  {address.is_default && (
                    <span className="default-badge">Default</span>
                  )}
                </div>

                <p>📞 {address.phone}</p>

                <p>
                  {address.house}, {address.street}
                </p>

                <p>
                  {address.city}, {address.state}
                </p>

                <p>{address.pincode}</p>
              </div>
            ))}

          {/* =================================================
              ADD ADDRESS FORM
          ================================================= */}

          {showAddressForm && (
            <form className="address-form" onSubmit={handleAddAddress}>
              <div className="address-form-header">
                <h4>Add New Address</h4>

                <button
                  type="button"
                  className="cancel-address-btn"
                  onClick={() => setShowAddressForm(false)}
                >
                  Cancel
                </button>
              </div>

              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={addressForm.full_name}
                onChange={handleAddressChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={addressForm.phone}
                onChange={handleAddressChange}
                required
              />

              <input
                type="text"
                name="house"
                placeholder="House / Flat / Door No."
                value={addressForm.house}
                onChange={handleAddressChange}
                required
              />

              <input
                type="text"
                name="street"
                placeholder="Street / Area"
                value={addressForm.street}
                onChange={handleAddressChange}
                required
              />

              <div className="address-two-column">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  required
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={addressForm.state}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={addressForm.pincode}
                onChange={handleAddressChange}
                required
              />

              <label className="default-address-checkbox">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={addressForm.is_default}
                  onChange={handleAddressChange}
                />

                <span>Make this my default address</span>
              </label>

              <button
                type="submit"
                className="save-address"
                disabled={savingAddress}
              >
                {savingAddress ? "Saving..." : "Save Address"}
              </button>
            </form>
          )}
        </div>

        {/* =====================================================
            ORDER SUMMARY
        ===================================================== */}

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

        {/* =====================================================
            PAYMENT
        ===================================================== */}

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

      {/* =======================================================
          BOTTOM BAR
      ======================================================= */}

      <div className="place-order-bar">
        <div className="place-order-content">
          <div>
            <small>Total Payable</small>

            <h2>₹{total}</h2>
          </div>

          <button
            className="place-order"
            onClick={placeOrder}
            disabled={!selectedAddress || cartItems.length === 0}
          >
            Place Order
          </button>
        </div>
      </div>

      <BottomNav />
    </>
  );
}

export default Checkout;
