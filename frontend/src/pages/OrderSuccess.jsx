import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/ordersuccess.css";

function OrderSuccess() {

    const navigate = useNavigate();

    const orderId =
        "FR" +
        Math.floor(Math.random() * 1000000);

    return (

        <div className="success-page">

            <FaCheckCircle className="success-icon"/>

            <h1>

                Order Placed Successfully

            </h1>

            <p>

                Thank you for shopping with Fresh.

            </p>

            <div className="delivery-box">

                <h3>

                    Estimated Delivery

                </h3>

                <h2>

                    10 - 15 Minutes

                </h2>

            </div>

            <div className="order-box">

                <span>

                    Order ID

                </span>

                <strong>

                    #{orderId}

                </strong>

            </div>

            <button

                className="continue-btn"

                onClick={() => navigate("/")}

            >

                Continue Shopping

            </button>

        </div>

    );

}

export default OrderSuccess;