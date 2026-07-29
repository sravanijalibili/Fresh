import { useEffect, useState } from "react";
import axios from "axios";
import CategoryCard from "../components/CategoryCard";
import "../styles/categorycard.css";

function Home() {

    const [categories, setCategories] = useState([]);

    useEffect(() => {

        axios
            .get("https://fresh-backend-1007.onrender.com/api/categories/")
            .then((res) => {
                console.log(res.data);
                setCategories(res.data);

            });

    }, []);

    return (

        <div className="categories-section">

            <h2 className="categories-title">

                Browse Categories

            </h2>

            <div className="categories-grid">

                {categories.map((category) => (

                    <CategoryCard

                        key={category.id}

                        category={category}

                        onClick={() =>
                            window.location.href =
                                `/products/${category.id}`
                        }

                    />

                ))}

            </div>

        </div>

    );

}

export default Home;