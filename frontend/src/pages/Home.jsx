import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import BottomNav from "../components/BottomNav";
import "../styles/categorycard.css";
import "../styles/productcard.css";
import API from "../services/api";

function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);


  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = () => {
    API.get('categories/').then((res) => {
      setCategories(res.data);
    });
  };

  const loadProducts = () => {
    API.get('products/').then((res) => {
      setProducts(res.data);

      setSelectedCategory(null);
    });
  };

  const loadCategoryProducts = (categoryId) => {
    API.get(`${BASE_URL}/products/${categoryId}/`).then((res) => {
      setProducts(res.data);

      setSelectedCategory(categoryId);
    });
  };

  return (
    <>
      <div className="categories-section">
        <h2 className="categories-title">Browse Categories</h2>

        <div className="categories-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => navigate(`/products/${category.id}`)}
            />
          ))}
        </div>
      </div>

      <div className="products-section">
        <h2 className="products-title">
          {selectedCategory ? "Category Products" : "Fresh Products"}
        </h2>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}

export default Home;
