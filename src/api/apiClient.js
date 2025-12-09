import axios from "axios";


const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://military-asset-management-system-backend-80y6.onrender.com/",
});

api.interceptors.request.use((config) => {
  const authHeader = localStorage.getItem("authHeader");

  if (authHeader) {
    config.headers.Authorization = authHeader;
  }

  return config;
});

export default api;
