import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { login as loginRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext"; // ✅ IMPORTANTE
import styles from "./AdminLogin.module.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ usar AuthContext

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Se já tiver token e for admin, segue pro painel
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwt_decode(token);
      if (decoded?.role?.toLowerCase() === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      }
    } catch {
      // token inválido -> ignora
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ sua função loginRequest(email,password) precisa retornar { access_token }
      const result = await loginRequest(email, password);

      const accessToken = result?.access_token || result?.data?.access_token;
      if (!accessToken) {
        setError("Token inválido ou usuário não encontrado.");
        return;
      }

      // ✅ valida role no token
      let decoded;
      try {
        decoded = jwt_decode(accessToken);
      } catch {
        setError("Token inválido.");
        return;
      }

      if (!decoded?.role || decoded.role.toLowerCase() !== "admin") {
        setError("Acesso negado: você não é administrador.");
        return;
      }

      // ✅ atualiza AuthContext + salva token
      const ok = login(accessToken, "admin");
      if (!ok) {
        setError("Acesso negado: você não é administrador.");
        return;
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao logar como admin.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* LADO ESQUERDO */}
      <div className={styles.left}>
        <div className={styles.bannerContent}>
          <h1>PAINEL ADMIN</h1>
          <p>Gestão e controle da plataforma</p>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className={styles.right}>
        <div className={styles.box}>
          <h1 className={styles.title}>PAIXÃO ADMIN</h1>
          <h2>Login Administrativo</h2>

          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
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
    </div>
  );
}