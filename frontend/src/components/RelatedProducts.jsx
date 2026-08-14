import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ProductCard from "./ProductCard";
import { getRelatedProducts } from "../services/productService";

import "../styles/relatedproducts.css";

function RelatedProducts({ productId }) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRelatedProducts();
  }, [productId]);

  const loadRelatedProducts = async () => {
    try {
      setLoading(true);

      const data = await getRelatedProducts(productId);

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Related products loading error:",
        error
      );

      toast.error("Unable to load related products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="related-products-section">
        <h2>More from this category</h2>

        <div className="related-products-loading">
          Loading products...
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="related-products-section">

      <div className="related-products-header">

        <div>
          <h2>More from this category</h2>

          <p>
            Fresh products you may also like
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/products/${products[0].category}`
            )
          }
        >
          View All
        </button>

      </div>

      <div className="related-products-grid">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </section>
  );
}

export default RelatedProducts;