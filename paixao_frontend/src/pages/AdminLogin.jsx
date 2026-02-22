import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { login as loginRequest } from "../api/auth";
import styles from "./AdminLogin.module.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Se já logado como admin, redireciona
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwt_decode(token);
      if (decoded.role?.toLowerCase() === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      }
    } catch {}
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginRequest(email, password);

      if (!result?.access_token) {
        setError("Token inválido ou usuário não encontrado.");
        return;
      }

      const decoded = jwt_decode(result.access_token);

      if (!decoded.role || decoded.role.toLowerCase() !== "admin") {
        setError("Acesso negado: você não é administrador.");
        return;
      }

      // Salva token no localStorage
      localStorage.setItem("token", result.access_token);

      navigate("/admin/dashboard", { replace: true });

    } catch (err) {
      setError(err.message || "Erro ao logar como admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.title}>PAIXÃO ADMIN</h1>
        <h2>Painel Administrativo - Login</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
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
    </div>
  );
}