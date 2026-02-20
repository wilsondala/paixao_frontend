import api from "./client";


export async function register(data) {
  const response = await fetch("http://localhost:8000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao registrar usuário");
  }

  const result = await response.json();

  return result.access_token; // ajuste se sua API retornar diferente
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
