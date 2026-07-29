import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./../styles/navbar.css";

function Navbar() {

    const navigate = useNavigate();

    const { cartItems } = useCart();

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (

        <nav className="navbar">

            <div>

                <h2>🌿 Fresh</h2>

                <p>Deliver in 10 Minutes</p>

            </div>

            <div
                className="cart"
                onClick={() => navigate("/cart")}
            >

                <FaShoppingCart />

                {cartCount > 0 && (

                    <span className="cart-badge">

                        {cartCount}

                    </span>

                )}

            </div>

        </nav>

    );

}

export default Navbar;