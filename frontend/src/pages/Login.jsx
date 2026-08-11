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

      <div className="auth-card">

        <h1>
          Welcome Back 👋
        </h1>

        <p>
          Login to continue
        </p>


        <form
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="username"
            placeholder="Username or Email"
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


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>

        </form>


        <p className="auth-link">

          Don't have an account?

          <Link to="/signup">
            {" "}Sign Up
          </Link>

        </p>

      </div>

    </div>

  );

}


export default Login;