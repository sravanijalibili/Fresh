import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
  createProduct,
  updateProduct,
  getCategories,
} from "../services/productService";

import "../styles/productform.css";

function ProductForm({ product, onClose }) {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    category: "",

    name: "",

    quantity: "",

    price: "",

    image: null,
  });

  useEffect(() => {
    loadCategories();

    if (product) {
      setFormData({
        category: product.category,

        name: product.name,

        quantity: product.quantity,

        price: product.price,

        image: null,
      });
    }
  }, []);

  const loadCategories = async () => {
    const data = await getCategories();

    setCategories(data);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,

      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = new FormData();

    body.append("category", formData.category);

    body.append("name", formData.name);

    body.append("quantity", formData.quantity);

    body.append("price", formData.price);

    if (formData.image) body.append("image", formData.image);

    try {
      if (product) {
        await updateProduct(product.id, body);

        toast.success("Product Updated");
      } else {
        await createProduct(body);

        toast.success("Product Added");
      }

      onClose();
    } catch {
      toast.error("Unable to save product");
    }
  };

  return (
    <div className="product-modal">
      <div className="product-card">
        <h2>{product ? "Edit Product" : "Add Product"}</h2>

        <form onSubmit={handleSubmit}>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
          />

          <input
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />

          <input type="file" name="image" onChange={handleChange} />

          {product && product.image && (
            <img
              src={`http://127.0.0.1:8000${product.image}`}
              alt={product.name}
              style={{
                width: "120px",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            />
          )}

          <div className="buttons">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
