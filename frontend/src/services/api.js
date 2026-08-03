import axios from "axios";

const API = axios.create({
  // baseURL: "https://fresh-backend-1007.onrender.com/api",
    baseURL: "http://127.0.0.1:8000//api",
});

export default API;
