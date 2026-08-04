import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaBox,
  FaList,
  FaShoppingCart,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";

import "../styles/sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        Fresh Admin
      </div>

      <nav>

        <NavLink to="/admin/dashboard">
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/admin/products">
          <FaBox />
          Products
        </NavLink>

        <NavLink to="/admin/categories">
          <FaList />
          Categories
        </NavLink>

        <NavLink to="/admin/orders">
          <FaShoppingCart />
          Orders
        </NavLink>

        <NavLink to="/admin/customers">
          <FaUsers />
          Customers
        </NavLink>

        <NavLink to="/admin/analytics">
          <FaChartBar />
          Analytics
        </NavLink>

      </nav>

      <button className="logout-btn">

        <FaSignOutAlt />

        Logout

      </button>

    </aside>
  );
}

export default Sidebar;