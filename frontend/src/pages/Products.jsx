import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import BottomNav from "../components/BottomNav";
import "../styles/productcard.css";
import API from "../services/api";

function Products() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get(`products/${categoryId}/`)
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
      <BottomNav />
    </>
  );
}

export default Products;
