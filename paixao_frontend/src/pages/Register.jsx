import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import styles from "./Register.module.css";

export default function Register() {
  const navigate = useNavigate();
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
      const result = await register({ name, email, phone, password });
      login(result.token); // salva token no contexto
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className={styles.container}>
    {/* LADO ESQUERDO */}
    <div className={styles.leftSide}>
      <h1>CRIAR CONTA</h1>
      <p>Cadastre-se para acessar a plataforma</p>
    </div>

    {/* LADO DIREITO */}
    <div className={styles.rightSide}>
      <div className={styles.box}>
        <h2>Registro</h2>
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