import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { login as loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import toast from "react-hot-toast";

import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ==========================================
  // Handle Input Changes
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // Handle Login
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Call the single login API
      const data = await loginUser(formData);

      // Store user + JWT using AuthContext
      login(
        data.user,
        data.access,
        data.refresh
      );

      toast.success("Login Successful");

      // ======================================
      // ADMIN
      // ======================================

      if (
        data.user.is_staff === true ||
        data.user.is_superuser === true
      ) {
        navigate(
          "/admin/dashboard",
          { replace: true }
        );

        return;
      }

      // ======================================
      // NORMAL CUSTOMER
      // ======================================

      const from =
        location.state?.from?.pathname || "/";

      navigate(
        from,
        { replace: true }
      );

    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      toast.error(
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.error ||
        "Invalid username or password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ======================================
          Decorative Background
      ====================================== */}

      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />

      <div className="auth-container">

        {/* ======================================
            LEFT BRANDING SECTION
        ====================================== */}

        <div className="auth-brand-section">

          <div className="brand-logo">
            <span className="brand-logo-icon">
              🥬
            </span>

            <span>
              Fresh
            </span>
          </div>

          <h2>
            Fresh groceries,
            <br />
            delivered to your door.
          </h2>

          <p>
            Shop fresh vegetables, fruits and
            everyday essentials with ease.
          </p>

          <div className="fresh-features">

            <div className="fresh-feature">
              <span>🥦</span>
              <div>
                <strong>Fresh Products</strong>
                <small>
                  Quality groceries every day
                </small>
              </div>
            </div>

            <div className="fresh-feature">
              <span>🚚</span>
              <div>
                <strong>Fast Delivery</strong>
                <small>
                  Delivered right to your doorstep
                </small>
              </div>
            </div>

            <div className="fresh-feature">
              <span>🔒</span>
              <div>
                <strong>Secure Shopping</strong>
                <small>
                  Your account is always protected
                </small>
              </div>
            </div>

          </div>

        </div>

        {/* ======================================
            LOGIN CARD
        ====================================== */}

        <div className="auth-card">

          <div className="auth-card-header">

            <div className="mobile-brand-logo">
              <span>🥬</span>
            </div>

            <h1>
              Welcome Back 👋
            </h1>

            <p>
              Login to continue to Fresh
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            {/* Username */}

            <div className="input-group">

              <label htmlFor="username">
                Username
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />

              </div>

            </div>

            {/* Password */}

            <div className="input-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>

            {/* Login Button */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner" />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <span className="login-arrow">
                    →
                  </span>
                </>
              )}

            </button>

          </form>

          {/* Signup */}

          <div className="auth-link">

            <span>
              Don't have an account?
            </span>

            <Link to="/signup">
              Sign Up
            </Link>

          </div>

          <div className="login-footer">
            <span>🌱</span>
            Fresh shopping made simple
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;