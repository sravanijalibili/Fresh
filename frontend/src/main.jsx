import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "leaflet/dist/leaflet.css";
import { WishlistProvider } from "./context/WishlistContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            toastOptions={{
              duration: 2000,
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
