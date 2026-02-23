import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://paixao-backend.onrender.com",
  timeout: 10000,
});

// 🔐 Interceptor para enviar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;