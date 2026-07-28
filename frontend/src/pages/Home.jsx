import { useEffect, useState } from "react";

import API from "../services/api";

import Navbar from "../components/Navbar";

import CategoryCard from "../components/CategoryCard";

function Home() {

    const [categories, setCategories] = useState([]);

    useEffect(() => {

        loadCategories();

    }, []);

    async function loadCategories() {

        try {

            const response = await API.get("categories/");

            console.log(response.data);

            setCategories(response.data);

        }

        catch (error) {

            console.log(error);

        }

    }

    return (

        <>

            <Navbar />

            <div className="container">

                <div className="grid">

                    {

                        categories.map(category => (

                            <CategoryCard
                                key={category.id}
                                category={category}
                            />

                        ))

                    }

                </div>

            </div>

        </>

    );

}

export default Home;