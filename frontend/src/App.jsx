import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import HeroBanner from "./components/HeroBanner";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import BottomNav from "./components/BottomNav";
import Categories from "./pages/Categories";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import ScrollToTop from "./components/ScrollToTop";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Addresses from "./pages/Addresses";
import OrderDetails from "./pages/OrderDetails";
import AdminLayout from "./admin/layouts/AdminLayout";

import Dashboard from "./admin/pages/Dashboard";
import AdminProducts from "./admin/pages/Products";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminOrders from "./admin/pages/Orders";
import AdminCustomers from "./admin/pages/AdminCustomers";
import AdminCustomerDetails from "./admin/pages/AdminCustomerDetails";

function AppContent() {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HeroBanner />
              <Home />
            </>
          }
        />

        <Route
          path="/products/:categoryId"
          element={
            <>
              <Navbar />
              <Products />
            </>
          }
        />

        <Route
          path="/product/:productId"
          element={
            <>
              <Navbar />
              <ProductDetails />
            </>
          }
        />

        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <Cart />
            </>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Checkout />
              </>
            </ProtectedRoute>
          }
        />
        <Route path="/categories" element={<Categories />} />

        <Route path="/order-success" element={<OrderSuccess />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Account />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Orders />
              </>
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Profile />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Addresses />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <OrderDetails />
              </>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="customers/:id" element={<AdminCustomerDetails />} />
        </Route>
      </Routes>

      {!isAdmin && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
