import { useState } from "react";
import { useNavigate, Navigate, useLocation, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { login as loginRequest } from "../api/auth";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/products";

  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwt_decode(token);

      if (decoded.role?.toLowerCase() === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      }

      return <Navigate to={redirectTo} replace />;
    } catch {
      localStorage.removeItem("token");
    }
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
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Erro ao logar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.bannerContent}>
          <h1>PAIXÃO ANGOLA</h1>
          <p>Transformando visão em inovação</p>
        </div>
      </div>

      <div className={styles.right}>
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
              {loading ? "Entrando..." : "ENTRAR"}
            </button>
          </form>

          <div className={styles.switchAuth}>
            <span>Ainda não tem cadastro?</span>
            <Link
              to="/register"
              state={{ from: redirectTo }}
              className={styles.switchLink}
            >
              Criar minha conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}