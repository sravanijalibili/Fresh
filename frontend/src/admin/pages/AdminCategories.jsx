import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import "../styles/categories.css";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);

      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);

      toast.error("Unable to load categories");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAdd = () => {
    setSelectedCategory(null);

    setFormData({
      name: "",
      image: null,
    });

    setShowForm(true);
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const handleEdit = (category) => {
    setSelectedCategory(category);

    setFormData({
      name: category.name,
      image: null,
    });

    setShowForm(true);
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // =====================================================
  // SAVE CATEGORY
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const body = new FormData();

      body.append("name", formData.name);

      if (formData.image) {
        body.append("image", formData.image);
      }

      if (selectedCategory) {
        await updateCategory(selectedCategory.id, body);

        toast.success("Category Updated");
      } else {
        if (!formData.image) {
          toast.error("Category image is required");
          return;
        }

        await createCategory(body);

        toast.success("Category Added");
      }

      setShowForm(false);

      setSelectedCategory(null);

      setFormData({
        name: "",
        image: null,
      });

      loadCategories();
    } catch (error) {
      console.error(error);

      toast.error("Unable to save category");
    }
  };

  // =====================================================
  // DELETE CATEGORY
  // =====================================================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) {
      return;
    }

    try {
      await deleteCategory(id);

      toast.success("Category Deleted");

      loadCategories();
    } catch (error) {
      console.error(error);

      toast.error("Unable to delete category");
    }
  };

  // =====================================================
  // CANCEL FORM
  // =====================================================

  const handleCancel = () => {
    setShowForm(false);

    setSelectedCategory(null);

    setFormData({
      name: "",
      image: null,
    });
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="admin-categories">
      {/* PAGE HEADER */}

      <div className="page-top">
        <h2>Categories</h2>

        <button className="add-btn" onClick={handleAdd}>
          + Add Category
        </button>
      </div>

      {/* LOADING */}

      {loading && <p className="loading-text">Loading categories...</p>}

      {/* =================================================
          DESKTOP TABLE
      ================================================= */}

      {!loading && (
        <div className="desktop-category-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>

                <th>Name</th>
                <th>Product Count</th>

                <th>Products</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-cell">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="category-thumb"
                        />
                      )}
                    </td>

                    <td>{category.name}</td>

                    <td>
                      <span className="product-count">
                        {category.products?.length || 0}
                      </span>
                    </td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(category.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* =================================================
          MOBILE CARDS
      ================================================= */}

      {!loading && (
        <div className="mobile-category-list">
          {categories.map((category) => (
            <div className="category-card-mobile" key={category.id}>
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-mobile-image"
                />
              )}

              <div className="category-mobile-info">
                <h3>{category.name}</h3>

                <p className="product-count-mobile">
                  <strong>Products:</strong> {category.products?.length || 0}
                </p>

                <div className="category-mobile-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(category.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showForm && (
        <div className="category-modal">
          <div className="category-form-card">
            <h2>{selectedCategory ? "Edit Category" : "Add Category"}</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Category Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />

              {selectedCategory && selectedCategory.image && (
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  className="category-preview"
                />
              )}

              <div className="category-form-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  {selectedCategory ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
