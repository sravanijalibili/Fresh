import { FaShoppingCart } from "react-icons/fa";
import "./../styles/navbar.css";

function Navbar(){

    return(

        <nav className="navbar">

            <div>

                <h2>🌿 Fresh</h2>

                <p>Deliver in 10 Minutes</p>

            </div>

            <div className="cart">

                <FaShoppingCart/>

            </div>

        </nav>

    )

}

export default Navbar;