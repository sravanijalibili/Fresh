import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";

import "../styles/categories.css";
import API from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    API
      .get("categories/")
      .then((response) => setCategories(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Navbar />

      <PageHeader title="Categories" />

      <div className="categories-page">
        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => navigate(`/products/${category.id}`)}
            >
              <img src={category.image} alt={category.name} />

              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Categories;
