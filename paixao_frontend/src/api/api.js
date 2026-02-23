import axios from "axios";

// Criação da instância Axios
const api = axios.create({
  baseURL: "https://paixao-backend.onrender.com",
  timeout: 60000, // 60 segundos
});

// 🔐 Interceptor para incluir token automaticamente
api.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage (admin ou usuário normal)
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

// 🚨 Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token inválido ou expirado
      console.warn("Token inválido ou expirado.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (status === 403) {
      // Acesso proibido (role insuficiente)
      console.warn("Acesso negado: você precisa ser ADMIN.");
      alert("Acesso negado: você precisa ser ADMIN.");
    } else if (status >= 500) {
      // Erros de servidor
      console.error("Erro no servidor. Tente novamente mais tarde.");
    }

    return Promise.reject(error);
  }
);

export default api;