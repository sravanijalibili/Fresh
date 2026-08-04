import API from "../../services/api";

// Get all products
export const getProducts = async () => {
  const res = await API.get("/admin/products/");
  return res.data;
};

// Get all categories
export const getCategories = async () => {
  const res = await API.get("/categories/");
  return res.data;
};

// Create product
export const createProduct = async (formData) => {
  const res = await API.post(
    "/admin/products/create/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

// Update product
export const updateProduct = async (id, formData) => {
  const res = await API.put(
    `/admin/products/${id}/update/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

// Delete product
export const deleteProduct = async (id) => {
  await API.delete(`/admin/products/${id}/delete/`);
};