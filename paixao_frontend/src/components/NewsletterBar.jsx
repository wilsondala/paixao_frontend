import { useState } from "react";
import styles from "./NewsletterBar.module.css";

export default function NewsletterBar() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return alert("Informe seu e-mail.");

    try {
      setLoading(true);

      // ✅ Por enquanto (sem backend): só simula
      // Depois a gente liga num endpoint tipo POST /newsletter
      await new Promise((r) => setTimeout(r, 400));

      alert("Cadastro realizado ✅");
      setName("");
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.bar}>
      <form className={styles.inner} onSubmit={submit}>
        <h3 className={styles.title}>CADASTRE-SE PARA RECEBER LANÇAMENTOS</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite seu nome"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail"
          type="email"
        />

        <button type="submit" disabled={loading}>
          {loading ? "ENVIANDO..." : "QUERO RECEBER"}
        </button>
      </form>
    </section>
  );
}