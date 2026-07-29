import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import "../styles/productcard.css";

function Products() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(
        `https://fresh-backend-1007.onrender.com/api/products/${categoryId}/`,
      )
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [categoryId]);

  return (
    <>
      <PageHeader title="Products" />
      <div className="products-section">
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Products;
