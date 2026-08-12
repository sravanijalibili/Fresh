import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getProducts, deleteProduct } from "../services/productService";

import ProductForm from "../components/ProductForm";
import API_BASE_URL from "../../services/api";
import "../styles/products.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      toast.error("Unable to load products");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(id);

      toast.success("Product Deleted");

      loadProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="admin-products">
      <div className="page-top">
        <h2>Products</h2>

        <button
          className="add-btn"
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
        >
          + Add Product
        </button>
      </div>

      {/* ================= Desktop Table ================= */}

      <div className="desktop-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-thumb"
                  />
                </td>

                <td>{product.name}</td>

                <td>{product.category_name}</td>

                <td>{product.quantity}</td>

                <td>₹{product.price}</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= Mobile Cards ================= */}

      <div className="mobile-products">
        {products.map((product) => (
          <div className="product-card-mobile" key={product.id}>
            <img src={product.image} alt={product.name} />

            <div className="product-info">
              <h3>{product.name}</h3>

              <p>
                <strong>Category:</strong> {product.category_name}
              </p>

              <p>
                <strong>Quantity:</strong> {product.quantity}
              </p>

              <h4>₹{product.price}</h4>

              <div className="mobile-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ProductForm
          product={selectedProduct}
          onClose={() => {
            setShowForm(false);
            loadProducts();
          }}
        />
      )}
    </div>
  );
}

export default AdminProducts;
