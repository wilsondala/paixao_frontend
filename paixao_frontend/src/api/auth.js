import api from "./client";

export async function login(email, password) {
  try {
    const form = new URLSearchParams();
    form.append("username", email); // OAuth2 espera "username"
    form.append("password", password);

    const response = await api.post("/auth/login", form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // backend FastAPI normalmente retorna:
    // { access_token: "...", token_type: "bearer" }

    return response.data.access_token;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Email ou senha inválidos");
    }

    throw new Error("Erro ao fazer login. Tente novamente.");
  }
}
