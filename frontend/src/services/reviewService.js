import API from "./api";

// ============================================================
// GET PRODUCT REVIEWS
// ============================================================

export const getProductReviews = async (productId) => {
  const response = await API.get(
    `reviews/product/${productId}/`
  );

  return response.data;
};

// ============================================================
// GET PRODUCT RATING
// ============================================================

export const getProductRating = async (productId) => {
  const response = await API.get(
    `reviews/product/${productId}/rating/`
  );

  return response.data;
};

// ============================================================
// GET MY REVIEW
// ============================================================

export const getMyReview = async (productId) => {
  const response = await API.get(
    `reviews/product/${productId}/my/`
  );

  return response.data;
};

// ============================================================
// CREATE REVIEW
// ============================================================

export const createReview = async (
  productId,
  rating,
  comment
) => {
  const response = await API.post(
    `reviews/product/${productId}/create/`,
    {
      rating,
      comment,
    }
  );

  return response.data;
};

// ============================================================
// UPDATE MY REVIEW
// ============================================================

export const updateReview = async (
  productId,
  rating,
  comment
) => {
  const response = await API.patch(
    `reviews/product/${productId}/my/`,
    {
      rating,
      comment,
    }
  );

  return response.data;
};

// ============================================================
// DELETE MY REVIEW
// ============================================================

export const deleteReview = async (productId) => {
  const response = await API.delete(
    `reviews/product/${productId}/my/`
  );

  return response.data;
};