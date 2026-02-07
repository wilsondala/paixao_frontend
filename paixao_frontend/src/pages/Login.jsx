import { useState } from "react";
import api from "../api/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 👇 OAuth2 exige x-www-form-urlencoded
      const form = new URLSearchParams();
      form.append("username", email); // NÃO mudar para email
      form.append("password", password);

      const response = await api.post("/auth/login", form, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const token = response.data.access_token;
      localStorage.setItem("token", token);

      alert("Login realizado com sucesso ✅");
    } catch (err) {
      console.error(err);
      setError("Credenciais inválidas");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
          required
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
