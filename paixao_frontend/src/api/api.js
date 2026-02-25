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

// ✅ Export default para poder importar diretamente
export default api;