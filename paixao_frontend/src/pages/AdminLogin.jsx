import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginRequest } from "../api/auth";
import styles from "./AdminLogin.module.css";

export default function AdminLogin() {
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Se já logado e for admin → vai direto pro painel
  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (authLoading) {
    return <div className={styles.container}>Carregando autenticação...</div>;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = await loginRequest(email, password);

      login(token); // 🔥 CENTRALIZAÇÃO NO AUTHCONTEXT

      // Aguarda pequeno delay para o user atualizar
      setTimeout(() => {
        if (user?.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          setError("Acesso negado: você não é administrador.");
        }
      }, 200);

    } catch (err) {
      setError(err.message || "Email ou senha inválidos.");
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

        <button type="submit" disabled={loading || authLoading}>
          {loading ? "Entrando..." : "Login"}
        </button>
      </form>
    </div>
  );
}
