import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import API from "../services/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

function Products() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    useEffect(() => {

        loadProducts();

    }, [id]);

    async function loadProducts() {

        try {

            const response = await API.get(`products/${id}/`);

            setProducts(response.data);

        }

        catch (error) {

            console.log(error);

        }

    }

    return (

        <>

            <Navbar />

            <div className="container">

                <button
                    className="back"
                    onClick={() => navigate("/")}
                >
                    ← Back
                </button>

                <div className="grid">

                    {

                        products.map(product => (

                            <ProductCard
                                key={product.id}
                                product={product}
                            />

                        ))

                    }

                </div>

            </div>

        </>

    );

}

export default Products;