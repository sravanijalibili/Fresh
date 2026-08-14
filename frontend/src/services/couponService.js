import API from "./api";

export const getCoupons = async () => {
  const response = await API.get("/coupons/");
  return response.data;
};

export const applyCoupon = async (code, orderAmount) => {
  const response = await API.post("/coupons/apply/", {
    code,
    order_amount: orderAmount,
  });

  return response.data;
};