import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import BottomNav from "../components/BottomNav";
import SearchBar from "../components/SearchBar";
import "../styles/categorycard.css";
import "../styles/productcard.css";
import API from "../services/api";

function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = () => {
    API.get("categories/")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.log(err));
  };

  const loadProducts = () => {
    API.get("products/")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];

        setProducts(data);
      })
      .catch((err) => console.log(err));
  };

  // Search Products
  const filteredProducts = products.filter((product) => {
    const keyword = searchTerm.toLowerCase();

    return (
      product.name.toLowerCase().includes(keyword) ||
      (product.description || "").toLowerCase().includes(keyword)
    );
  });

  // Search Categories
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onClear={() => setSearchTerm("")}
      />

      {/* Show Categories only when Search is Empty */}

      {searchTerm === "" && (
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
      )}

      {/* Optional: Show matching category while searching */}

      {searchTerm !== "" && filteredCategories.length > 0 && (
        <div className="categories-section">
          <h2 className="categories-title">Matching Categories</h2>

          <div className="categories-grid">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => navigate(`/products/${category.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="products-section">
        <h2 className="products-title">
          {searchTerm === "" ? "Fresh Products" : "Search Results"}
        </h2>

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <div
              style={{
                width: "100%",
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              <h3>No products found 😔</h3>

              <p>Try searching with another keyword.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </>
  );
}

export default Home;