import { BrowserRouter, Routes, Route } from "react-router-dom";

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
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <SearchBar />
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
            <>
              <Navbar />
              <Checkout />
            </>
          }
        />
        <Route path="/categories" element={<Categories />} />

        <Route path="/order-success" element={<OrderSuccess />} />
        <Route
          path="/account"
          element={
            <>
              <Navbar />
              <Account />
            </>
          }
        />
        <Route
          path="/orders"
          element={
            <>
              <Navbar />
              <Orders />
            </>
          }
        />
      </Routes>{" "}
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;
