import styles from "./TestimonialsSection.module.css";

const DATA = [
  {
    name: "Janinha",
    tag: "Positivo",
    text:
      "Comprei pela primeira vez, amei tudo: atendimento, qualidade e entrega. Recomendo!",
    date: "21/10/2025",
  },
  {
    name: "Cinara de Souza Montiel",
    tag: "Positivo",
    text:
      "Minha primeira compra e recebi antes do prazo. Qualidade excelente!",
    date: "09/01/2025",
  },
  {
    name: "Giovanna",
    tag: "Positivo",
    text:
      "Impressionada com a loja. Produtos de boa qualidade e preço justo.",
    date: "09/08/2024",
  },
];

export default function TestimonialsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {DATA.map((t, i) => (
            <article key={i} className={styles.card}>
              <div className={styles.icon} aria-hidden="true">💬</div>

              <h3 className={styles.name}>{t.name}</h3>
              <div className={styles.tag}>{t.tag}</div>

              <p className={styles.text}>{t.text}</p>
              <div className={styles.date}>{t.date}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}