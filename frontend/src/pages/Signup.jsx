import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { register } from "../services/authService";
import toast from "react-hot-toast";
import "../styles/signup.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register(formData);

      toast.success("Account created successfully");

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        {/* Logo */}
        <div className="signup-logo">
          🌿
        </div>

        {/* Header */}
        <div className="signup-header">
          <h1>Create Account</h1>

          <p>Join Fresh Grocery and start shopping</p>
        </div>

        {/* Form */}
        <form className="signup-form" onSubmit={handleSubmit}>

          {/* Username */}
          <div className="signup-input-group">
            <label>Username</label>

            <div className="signup-input-wrapper">
              <FaUser className="signup-input-icon" />

              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="signup-input-group">
            <label>Email</label>

            <div className="signup-input-wrapper">
              <FaEnvelope className="signup-input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="signup-input-group">
            <label>Password</label>

            <div className="signup-input-wrapper">
              <FaLock className="signup-input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="signup-password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="signup-input-group">
            <label>Confirm Password</label>

            <div className="signup-input-wrapper">
              <FaLock className="signup-input-icon" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                placeholder="Confirm your password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="signup-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>
          </div>

          {/* Signup button */}
          <button
            type="submit"
            className="signup-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="signup-spinner"></span>
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="signup-login-link">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

        <div className="signup-footer">
          🌱 Fresh groceries. Fast delivery.
        </div>
      </div>
    </div>
  );
}

export default Signup;