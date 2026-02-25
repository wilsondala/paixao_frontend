// src/api/api.js
import axios from "axios";

// 🔥 Detecta ambiente corretamente
const isDev = import.meta.env.DEV;

const baseURL = isDev
  ? "http://127.0.0.1:8000"
  : import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error("API URL não definida.");
}

// Instância Axios
const api = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 INTERCEPTOR PARA ENVIAR TOKEN AUTOMATICAMENTE
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;