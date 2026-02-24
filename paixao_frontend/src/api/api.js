import axios from "axios";

// 🔥 Detecta ambiente automaticamente
const baseURL =
  import.meta.env.VITE_API_URL ||
  "https://paixao-backend.onrender.com";

// Instância Axios
const api = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// 🔐 INTERCEPTOR DE REQUEST
// ===============================
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

// ===============================
// 🚨 INTERCEPTOR DE RESPONSE
// ===============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Token inválido ou expirado.");
      localStorage.removeItem("token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } 
    else if (status === 403) {
      console.warn("Acesso negado: ADMIN necessário.");
      alert("Acesso negado: ADMIN necessário.");
    } 
    else if (status >= 500) {
      console.error("Erro interno no servidor.");
    }

    return Promise.reject(error);
  }
);

export default api;