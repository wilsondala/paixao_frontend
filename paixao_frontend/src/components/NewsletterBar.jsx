import { useState } from "react";
import styles from "./NewsletterBar.module.css";
import api from "../api/api";

export default function NewsletterBar() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: "success"|"info"|"error", message: string }

  const validateEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

  const onSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !validateEmail(cleanEmail)) {
      setFeedback({ type: "error", message: "⚠️ Digite um e-mail válido." });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/newsletter/", {
        name: cleanName || null,
        email: cleanEmail,
      });

      // backend recomendado: { ok, type, message }
      const type = data?.type || "success";
      const message =
        data?.message ||
        "✅ Cadastro realizado com sucesso! Em breve você receberá nossas novidades.";

      setFeedback({ type, message });

      if (data?.ok) {
        setName("");
        setEmail("");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "❌ Não foi possível concluir seu cadastro agora. Tente novamente em instantes.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.wrap} aria-label="Newsletter Paixão Angola">
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.kicker}>Novidades</p>
          <h3 className={styles.title}>Cadastre-se para receber lançamentos</h3>
          <p className={styles.subtitle}>
            Promoções, novos produtos e novidades da Paixão Angola direto no seu e-mail.
          </p>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.label}>
            <span className={styles.srOnly}>Nome</span>
            <input
              className={styles.input}
              placeholder="Seu nome (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>

          <label className={styles.label}>
            <span className={styles.srOnly}>E-mail</span>
            <input
              className={styles.input}
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
            />
          </label>

          <button className={styles.button} disabled={loading} type="submit">
            {loading ? "ENVIANDO..." : "QUERO RECEBER"}
          </button>

          {feedback?.message && (
            <div
              className={`${styles.msg} ${
                feedback.type === "error"
                  ? styles.error
                  : feedback.type === "info"
                  ? styles.info
                  : styles.success
              }`}
              role="status"
            >
              {feedback.message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}