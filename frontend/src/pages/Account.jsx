import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaUserCircle,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaHeart,
  FaGift,
  FaInfoCircle,
  FaHeadset,
  FaChevronRight,
  FaSignInAlt,
} from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import "../styles/account.css";
import { useAuth } from "../context/AuthContext";
import { FaSignOutAlt } from "react-icons/fa";

function Account() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const menuItems = [
    {
      title: "My Profile",
      subtitle: "View & update your profile",
      icon: <FaUserCircle />,
      action: () => navigate("/profile"),
    },

    {
      title: "My Orders",
      subtitle: "View all your orders",
      icon: <FaShoppingBag />,
      action: () => navigate("/orders"),
    },

    {
      title: "Saved Addresses",
      subtitle: "Manage delivery addresses",
      icon: <FaMapMarkerAlt />,
      action: () => navigate("/addresses"),
    },
    {
      title: "Wishlist",
      subtitle: "Your favourite products",
      icon: <FaHeart />,
      action: () => navigate("/wishlist"),
    },

    {
      title: "Offers & Coupons",
      subtitle: "Latest deals for you",
      icon: <FaGift />,
      action: () => navigate("/coupons"),    },

    {
      title: "Help & Support",
      subtitle: "Need any help?",
      icon: <FaHeadset />,
      action: () => toast("Support Coming Soon"),
    },

    {
      title: "About Fresh",
      subtitle: "About the app & developer",
      icon: <FaInfoCircle />,
      action: () => navigate("/about"),
    },
  ];

  return (
    <>
      <PageHeader title="Account" />

      <div className="account-page">
        <div className="profile-card">
          <FaUserCircle className="profile-avatar" />

          {user ? (
            <>
              <h2>Hello, {user.username} 👋</h2>

              <p>{user.email}</p>

              <small
                style={{
                  color: "#777",
                  display: "block",
                  marginTop: "6px",
                  marginBottom: "20px",
                }}
              >
                Welcome back to Fresh Grocery
              </small>

              <button
                className="login-btn"
                onClick={() => {
                  logout();
                  toast.success("Logged out successfully");
                  navigate("/login");
                }}
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              <h2>Welcome to Fresh</h2>

              <p>
                Login to track orders, save addresses and enjoy a personalized
                shopping experience.
              </p>

              <button className="login-btn" onClick={() => navigate("/login")}>
                <FaSignInAlt />
                Login / Sign Up
              </button>
            </>
          )}
        </div>

        <div className="account-menu">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-row" onClick={item.action}>
              <div className="menu-left">
                <div className="menu-icon">{item.icon}</div>

                <div>
                  <h4>{item.title}</h4>

                  <small>{item.subtitle}</small>
                </div>
              </div>

              <FaChevronRight />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Account;
