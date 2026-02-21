import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { register } from "../api/auth"; // precisa existir no seu auth.js
import { useAuth } from "../context/AuthContext";
import styles from "./Register.module.css"; // ⬅ importar CSS

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Cria usuário
      const token = await register({
        name,
        email,
        phone,
        password,
      });

      // Faz login automático
      login(token);

      // Volta para onde veio ou produtos
      const redirectTo = location.state?.from || "/login"; // ⬅ agora vai para login
      navigate(redirectTo, { replace: true });

    } catch (err) {
      setError(err.message || "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>PAIXÃO ANGOLA</h1>

        <div className={styles.box}>
          <h2>Criar Conta</h2>

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
        </div>
      </div>
    </div>
  );
}