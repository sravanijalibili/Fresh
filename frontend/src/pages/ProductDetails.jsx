import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import "../styles/productdetails.css";

function ProductDetails() {

    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {

        axios
            .get(
                `https://fresh-backend-1007.onrender.com/api/productDetails/${productId}/`
            )
            .then((res) => {

                setProduct(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    }, [productId]);

    if (!product) {

        return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

    }

    return (

     <div className="product-details">

    <button
        className="back-btn"
        onClick={() => navigate(-1)}
    >
        <FaArrowLeft /> Back
    </button>

    <div className="product-details-card">

        <div className="product-image-large">

            <img
                src={product.image}
                alt={product.name}
            />

        </div>

        <div className="product-info">

            <h1>{product.name}</h1>

            <div className="rating">
                ⭐ 4.8
            </div>

            <div className="product-price">
                ₹{product.price}
            </div>

            <div className="product-quantity">
                {product.quantity}
            </div>

            <div className="delivery">
                ⚡ Delivery in 10 mins
            </div>

            <div className="quantity-selector">

                <button
                    onClick={() =>
                        quantity > 1 &&
                        setQuantity(quantity - 1)
                    }
                >
                    <FaMinus />
                </button>

                <span>{quantity}</span>

                <button
                    onClick={() =>
                        setQuantity(quantity + 1)
                    }
                >
                    <FaPlus />
                </button>

            </div>

            <button className="cart-btn">

                <FaShoppingCart />

                Add to Cart

            </button>

        </div>

    </div>

</div>

    );

}

export default ProductDetails;