import { useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { adminLogin } from "../services/adminAuthService";

import "../styles/adminlogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await adminLogin(formData);

      localStorage.setItem(
        "admin_access",
        data.access
      );

      localStorage.setItem(
        "admin_refresh",
        data.refresh
      );

      localStorage.setItem(
        "admin_user",
        JSON.stringify(data.user)
      );

      toast.success("Welcome Admin");

      navigate("/admin/dashboard");

    } catch (err) {

      toast.error(
        err.response?.data?.error ||
        "Invalid Credentials"
      );

    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <h1>Fresh Admin</h1>

        <p>Administrator Login</p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminLogin;