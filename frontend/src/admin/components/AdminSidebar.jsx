import { NavLink } from "react-router-dom";

import {
    FaChartPie,
    FaBox,
    FaList,
    FaShoppingCart,
    FaUsers,
    FaTimes,
} from "react-icons/fa";

import "../styles/sidebar.css";

function AdminSidebar({ open, onClose }) {

    return (

        <aside className={`admin-sidebar ${open ? "open" : ""}`}>

            <div className="sidebar-top">

                <h2>Fresh Admin</h2>

                <button
                    className="close-btn"
                    onClick={onClose}
                >
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

        </aside>

    );

}

export default AdminSidebar;