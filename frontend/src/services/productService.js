import API from "./api";

export const getRelatedProducts = async (productId) => {
  const response = await API.get(
    `products/${productId}/related/`
  );

  return response.data;
};