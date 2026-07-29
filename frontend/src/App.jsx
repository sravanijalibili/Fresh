import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import HeroBanner from "./components/HeroBanner";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Home Page */}
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

        {/* Category Products */}
        <Route
          path="/products/:categoryId"
          element={
            <>
              <Navbar />
              <Products />
            </>
          }
        />

        {/* Product Details */}
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
      </Routes>

    </BrowserRouter>

  );

}

export default App;