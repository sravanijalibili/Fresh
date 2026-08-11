import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaBox,
  FaList,
  FaShoppingCart,
  FaUsers,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "../styles/sidebar.css";

function AdminSidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();

    // Close mobile sidebar
    if (onClose) {
      onClose();
    }

    // Go back to common login page
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className={`admin-sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-top">
        <h2>Fresh Admin</h2>

        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <NavLink to="/admin/dashboard" onClick={onClose}>
        <FaChartPie />
        Dashboard
      </NavLink>

      <NavLink to="/admin/products" onClick={onClose}>
        <FaBox />
        Products
      </NavLink>

      <NavLink to="/admin/categories" onClick={onClose}>
        <FaList />
        Categories
      </NavLink>

      <NavLink to="/admin/orders" onClick={onClose}>
        <FaShoppingCart />
        Orders
      </NavLink>

      <NavLink to="/admin/customers" onClick={onClose}>
        <FaUsers />
        Customers
      </NavLink>
      {/* ============================= */}
      {/* Logout */}
      {/* ============================= */}

      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
