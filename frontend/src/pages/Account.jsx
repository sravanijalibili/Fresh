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

function Account() {

  const navigate = useNavigate();

  const menuItems = [

    {
      title: "My Orders",
      subtitle: "View all your orders",
      icon: <FaShoppingBag />,
      action: () => toast("Login required"),
    },

    {
      title: "Saved Addresses",
      subtitle: "Manage delivery addresses",
      icon: <FaMapMarkerAlt />,
      action: () => toast("Login required"),
    },

    {
      title: "Wishlist",
      subtitle: "Your favourite products",
      icon: <FaHeart />,
      action: () => toast("Coming Soon"),
    },

    {
      title: "Offers & Coupons",
      subtitle: "Latest deals for you",
      icon: <FaGift />,
      action: () => toast("Coming Soon"),
    },

    {
      title: "Help & Support",
      subtitle: "Need any help?",
      icon: <FaHeadset />,
      action: () => toast("Support Coming Soon"),
    },

    {
      title: "About Fresh",
      subtitle: "Version 1.0",
      icon: <FaInfoCircle />,
      action: () => toast("Fresh Grocery App"),
    },

  ];

  return (

    <>

      <PageHeader title="Account" />

      <div className="account-page">

        <div className="profile-card">

          <FaUserCircle className="profile-avatar" />

          <h2>Welcome to Fresh</h2>

          <p>

            Login to track orders,
            save addresses and enjoy
            a personalized shopping experience.

          </p>

          <button

            className="login-btn"

            onClick={() => toast("Authentication module is under development")}

          >

            <FaSignInAlt />

            Login / Sign Up

          </button>

        </div>

        <div className="account-menu">

          {menuItems.map((item, index) => (

            <div

              key={index}

              className="menu-row"

              onClick={item.action}

            >

              <div className="menu-left">

                <div className="menu-icon">

                  {item.icon}

                </div>

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