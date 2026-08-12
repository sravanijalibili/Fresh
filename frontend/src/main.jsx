import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{
            duration: 2000,
          }}
        />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
