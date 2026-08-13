import { FaHome, FaThLarge, FaShoppingCart } from "react-icons/fa";

import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

import "../styles/bottomnav.css";

function BottomNav() {
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const location = useLocation();

  const hideBottomNav = [
    "/checkout",
    "/order-success",
    "/login",
    "/signup",
  ].includes(location.pathname);

  if (hideBottomNav) return null;

  // Logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.username || "";

  const initial = username
    ? username.charAt(0).toUpperCase()
    : "U";

  const menuItems = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "Categories",
      path: "/categories",
      icon: <FaThLarge />,
    },
    {
      name: "Cart",
      path: "/cart",
      icon: <FaShoppingCart />,
    },
    {
      name: "Account",
      path: "/account",
      initial: initial,
    },
  ];

  return (
    <div className="bottom-nav">
      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <div className="icon-wrapper">

            {item.initial ? (
              <span className="bottom-profile">
                {item.initial}
              </span>
            ) : (
              item.icon
            )}

            {item.name === "Cart" && cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}

          </div>

          <span>{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
}

export default BottomNav;