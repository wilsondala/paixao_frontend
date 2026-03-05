// src/api/api.js
import axios from "axios";

const isDev = import.meta.env.DEV;

// ✅ Base do backend (sem barra no final)
const baseURL = isDev
  ? "http://127.0.0.1:8000/api/v1"
  : (import.meta.env.VITE_API_URL || "").replace(/\/+$/, ""); // remove / no fim

if (!baseURL) {
  throw new Error("API URL não definida. Configure VITE_API_URL no .env");
}

const api = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Interceptor para enviar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;