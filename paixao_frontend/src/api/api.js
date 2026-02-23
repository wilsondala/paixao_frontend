import axios from "axios";

const api = axios.create({
  baseURL: "https://paixao-backend.onrender.com",
  timeout: 10000,
});

// 🔐 Interceptor para incluir token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🚨 Interceptor para tratar erros 401 automaticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token inválido ou expirado.");

      // opcional: limpar token e redirecionar
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;