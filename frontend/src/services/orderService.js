import axios from "axios";

const API = "http://127.0.0.1:8000/api/orders/";

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  },
});

export const placeOrder = async (orderData) => {
  const response = await axios.post(
    API + "place/",
    orderData,
    getHeaders()
  );

  return response.data;
};

export const getOrders = async () => {
  const response = await axios.get(
    API,
    getHeaders()
  );

  return response.data;
};

export const getOrder = async (id) => {
  const response = await axios.get(
    API + `${id}/`,
    getHeaders()
  );

  return response.data;
};


export const getOrderDetails = async (id) => {
  const response = await axios.get(
    API + `${id}/`,
    getHeaders()
  );

  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await axios.patch(
    API + `${id}/cancel/`,
    {},
    getHeaders()
  );

  return response.data;
};
