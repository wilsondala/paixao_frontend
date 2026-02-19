import api from "./client";

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

    if (!response.data?.access_token) {
      throw new Error("Resposta inválida do servidor.");
    }

    return response.data.access_token;

  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Email ou senha inválidos");
    }

    throw new Error("Erro ao fazer login. Tente novamente.");
  }
}
