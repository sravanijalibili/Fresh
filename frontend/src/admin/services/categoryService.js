import api from "../../services/api";


// =====================================================
// GET ALL CATEGORIES
// =====================================================

export const getCategories = async () => {

  const response = await api.get(
    "/admin/categories/"
  );

  return response.data;
};


// =====================================================
// CREATE CATEGORY
// =====================================================

export const createCategory = async (
  formData
) => {

  const response = await api.post(
    "/admin/categories/",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};


// =====================================================
// UPDATE CATEGORY
// =====================================================

export const updateCategory = async (
  id,
  formData
) => {

  const response = await api.put(
    `/admin/categories/${id}/`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};


// =====================================================
// DELETE CATEGORY
// =====================================================

export const deleteCategory = async (
  id
) => {

  await api.delete(
    `/admin/categories/${id}/`
  );
};