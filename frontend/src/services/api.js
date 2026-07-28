import axios from "axios";

const API = axios.create({
    baseURL: "https://fresh-backend-1007.onrender.com/api",
});

export default API;
