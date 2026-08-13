import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  // baseURL: "https://fresh-backend-1007.onrender.com/api",
});
// ============================================================
// ATTACH JWT TOKEN
// ============================================================

API.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("admin_access");

  const userToken = localStorage.getItem("access");

  const token = adminToken || userToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
