import { useState } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import styles from "./Register.module.css";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/products";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await register({ name, email, phone, password });

      const token = result?.token || result?.access_token;

      if (!token) {
        setError("Cadastro realizado, mas nenhum token foi retornado.");
        return;
      }

      login(token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <h1>CRIAR CONTA</h1>
        <p>Cadastre-se para acessar a plataforma</p>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.box}>
          <h2>Registro</h2>

          <p className={styles.helperText}>
            Crie sua conta para continuar sua compra com segurança.
          </p>

          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="tel"
              placeholder="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Conta"}
            </button>
          </form>

          <div className={styles.switchAuth}>
            <span>Já tem cadastro?</span>
            <Link
              to="/login"
              state={{ from: redirectTo }}
              className={styles.switchLink}
            >
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}