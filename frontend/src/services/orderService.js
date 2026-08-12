import API from "./api";

// ============================================================
// PLACE ORDER
// ============================================================

export const placeOrder = async (orderData) => {
  const response = await API.post("/orders/place/", orderData);

  return response.data;
};

// ============================================================
// GET ALL ORDERS
// ============================================================

export const getOrders = async () => {
  const response = await API.get("/orders/");

  return response.data;
};

// ============================================================
// GET SINGLE ORDER
// ============================================================

export const getOrder = async (id) => {
  const response = await API.get(`/orders/${id}/`);

  return response.data;
};

// ============================================================
// GET ORDER DETAILS
// ============================================================

export const getOrderDetails = async (id) => {
  const response = await API.get(`/orders/${id}/`);

  return response.data;
};

// ============================================================
// CANCEL ORDER
// ============================================================

export const cancelOrder = async (id) => {
  const response = await API.patch(`/orders/${id}/cancel/`, {});

  return response.data;
};
