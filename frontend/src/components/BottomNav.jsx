import { FaHome, FaThLarge, FaShoppingCart, FaUser } from "react-icons/fa";

import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/bottomnav.css";

function BottomNav() {
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const location = useLocation();

  const hideBottomNav = [
    "/cart",
    "/checkout",
    "/order-success",
    "/login",
    "/signup",
  ].includes(location.pathname);

  if (hideBottomNav) return null;

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
      icon: <FaUser />,
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
            {item.icon}

            {item.name === "Cart" && cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>

          <span>{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
}

export default BottomNav;
