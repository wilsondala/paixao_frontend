import { useState } from "react";
import { login as loginRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Se já autenticado, volta para onde veio ou products
  if (isAuthenticated) {
    const redirectTo = location.state?.from || "/products";
    return <Navigate to={redirectTo} replace />;
  }

  if (authLoading) {
    return (
      <div className={styles["login-container"]}>
        Carregando autenticação...
      </div>
    );
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const { token, user } = await login(email, password);

    authLogin(token, user);

    navigate("/", { replace: true });

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles["login-container"]}>
      <h2>Login</h2>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button type="submit" disabled={loading || authLoading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}