import { FaShoppingCart } from "react-icons/fa";
import { useNavigate, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const { cartItems } = useCart();

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Temporary profile initial
  // Later we can get this from the logged-in user's data.
  const profileInitial = "S";

  return (
    <nav className="navbar">
      {/* =================================================
          BRAND
      ================================================= */}

      <div
        className="navbar-brand"
        onClick={() => navigate("/")}
      >
        <h2>🌿 Fresh</h2>

        <p>Deliver in 10 Minutes</p>
      </div>

      {/* =================================================
          DESKTOP MENU
      ================================================= */}

      <div className="desktop-menu">
        <NavLink to="/">Home</NavLink>

        <NavLink to="/categories">Categories</NavLink>

        <NavLink to="/cart">Cart</NavLink>

        <NavLink to="/account">Account</NavLink>
      </div>

      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="navbar-actions">
        {/* Profile */}

        <button
          type="button"
          className="profile-initial"
          onClick={() => navigate("/account")}
          aria-label="Open account"
        >
          {profileInitial}
        </button>

        {/* Cart */}

        <button
          type="button"
          className="cart"
          onClick={() => navigate("/cart")}
          aria-label="Open cart"
        >
          <FaShoppingCart />

          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;