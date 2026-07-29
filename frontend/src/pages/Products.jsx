import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../styles/productcard.css";

function Products() {

    const { categoryId } = useParams();

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

            <h2 className="products-title">

                Fresh Products

            </h2>

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