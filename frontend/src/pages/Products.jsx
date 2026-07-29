import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../styles/productcard.css";

function Products() {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        axios
            .get("https://fresh-backend-1007.onrender.com/api/products/")
            .then((res) => {

                setProducts(res.data);

            });

    }, []);

    return (

        <div className="products-section">

            <h2 className="products-title">

                Fresh Products

            </h2>

            <div className="products-grid">

                {products.map((product)=>(

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