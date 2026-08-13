import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { NavLink } from "react-router-dom";

import "./../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const { cartItems } = useCart();

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.username || "";

  const initial = username
    ? username.charAt(0).toUpperCase()
    : "U";

  return (
    <nav className="navbar">

      {/* BRAND */}
      <div>
        <h2>🌿 Fresh</h2>

        <p>Deliver in 10 Minutes</p>
      </div>


      {/* DESKTOP MENU */}
      <div className="desktop-menu">

        <NavLink to="/">
          Home
        </NavLink>

        <NavLink to="/categories">
          Categories
        </NavLink>

        <NavLink to="/cart">
          Cart
        </NavLink>

        <NavLink to="/account">
          Account
        </NavLink>

      </div>


      {/* RIGHT SIDE */}
      <div className="navbar-right">

        {/* PROFILE INITIAL */}
        <button
          className="profile-initial"
          onClick={() => navigate("/account")}
        >
          {initial}
        </button>


        {/* CART */}
        <div
          className="cart"
          onClick={() => navigate("/cart")}
        >
          <FaShoppingCart />

          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}
        </div>

      </div>

    </nav>
  );
}

export default Navbar;