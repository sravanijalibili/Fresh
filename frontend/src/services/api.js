import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

API.interceptors.request.use((config) => {

  // Prefer admin token
  let token = localStorage.getItem("admin_access");

  // Otherwise use normal user token
  if (!token) {
    token = localStorage.getItem("access");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;