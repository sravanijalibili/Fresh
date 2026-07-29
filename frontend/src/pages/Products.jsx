import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../styles/productcard.css";

function Products() {

    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {

        axios
            .get(`https://fresh-backend-1007.onrender.com/api/products/${categoryId}/`)
            .then((res) => {

                setProducts(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    }, [categoryId]);

    return (

        <div className="products-section">

        <div className="products-header">

            <button
                className="back-button"
                onClick={() => navigate(-1)}
            >
                <FaArrowLeft />
                Back
            </button>

            <h2 className="products-title">
                Fresh Products
            </h2>

        </div>
            <div className="products-grid">

                {products.map((product) => (

                    <ProductCard
                        key={product.id}
                        product={product}
                    />

                ))}

            </div>

        </div>

    );

}

export default Products;