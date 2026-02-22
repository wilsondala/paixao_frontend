import api from "./client";

// Login de usuário/admin
export async function login(email, password) {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  const response = await api.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  // Backend FastAPI normalmente retorna { access_token, user, token_type... }
  const data = response.data;

  if (!data.access_token) {
    throw new Error("Token inválido ou usuário não encontrado.");
  }

  return {
    access_token: data.access_token,   // ← agora devolve com o nome que o Login espera
    user: data.user || data,
  };
}

// Registro de usuário (mesma correção)
export async function register(data) {
  const response = await api.post("/auth/register", data);

  const res = response.data;

  if (!res.access_token) {
    throw new Error("Erro ao registrar usuário.");
  }

  return {
    access_token: res.access_token,
    user: res.user || res,
  };
}