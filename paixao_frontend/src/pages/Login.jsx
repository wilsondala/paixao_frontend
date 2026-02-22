import { useState } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { login as loginRequest } from "../api/auth";
import styles from "./Login.module.css";
import MainLayout from "../layouts/MainLayout";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwt_decode(token);
      if (decoded.role?.toLowerCase() !== "admin") {
        const redirectTo = location.state?.from || "/products";
        return <Navigate to={redirectTo} replace />;
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

      localStorage.setItem("token", result.access_token);
      const decoded = jwt_decode(result.access_token);

      if (decoded.role?.toLowerCase() === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/products", { replace: true });
      }

    } catch (err) {
      setError(err.message || "Erro ao logar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>PAIXÃO ANGOLA</h1>
        <div className={styles.box}>
          <h2>Login</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}