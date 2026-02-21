import api from "./client";

export async function register(data) {
  try {
    const response = await api.post("/auth/register", data);

    return {
      token: response.data.access_token,
      user: {
        name: data.name,
        email: data.email,
      },
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Erro ao registrar usuário."
    );
  }
}

export async function login(email, password) {
  try {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);

    const response = await api.post("/auth/login", form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return {
      token: response.data.access_token,
      user: {
        email: email,
      },
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Email ou senha inválidos");
    }

    throw new Error("Erro ao fazer login.");
  }
}