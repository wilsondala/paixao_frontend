import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import qs from "qs";
import jwt_decode from "jwt-decode";
import { useUser } from "../context/UserContext";
import styles from "./AdminLogin.module.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Preencha email e senha");
      setLoading(false);
      return;
    }

    try {
      // Login via x-www-form-urlencoded
      const response = await api.post(
        "/auth/login",
        qs.stringify({
          username: email.trim(),
          password: password.trim(),
          grant_type: "",
          scope: "",
          client_id: "",
          client_secret: "",
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { access_token } = response.data;
      localStorage.setItem("token", access_token);

      // Decodifica o token para pegar o ID do usuário
      const decoded = jwt_decode(access_token);
      console.log("Payload do JWT:", decoded);

      // Busca dados completos do usuário via endpoint correto
        const userResponse = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${access_token}` },
        });
        const user = userResponse.data;
        setUser(user);

      // Se o backend fornecer role, pode verificar se é ADMIN
      if (user.role && user.role !== "ADMIN") {
        setError("Acesso negado: você não é administrador");
        setLoading(false);
        return;
      }

      // Redireciona para o dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Erro no login:", err.response?.data || err);

      if (err.response?.data?.error_description) {
        setError(err.response.data.error_description);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Email ou senha inválidos");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleLogin}>
        <h2>Painel Administrativo - Login</h2>

        {error && <p className={styles.error}>{error}</p>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Login"}
        </button>
      </form>
    </div>
  );
}
