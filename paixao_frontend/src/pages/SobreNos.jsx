import React from "react";
import styles from "./SobreNos.module.css";

export default function SobreNos() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>

        {/* FOTO */}
        <div className={styles.imageSection}>
          <div className={styles.imageGlow}></div>
          <img
            src="/imagem/produtos/wilson.jpg"
            alt="Wilson dos Santos Kahango Dala"
            className={styles.image}
          />
        </div>

        {/* TEXTO */}
        <div className={styles.textSection}>
          <span className={styles.badge}>Fundador</span>

          <h1 className={styles.name}>
            Wilson dos Santos Kahango Dala
          </h1>

          <h2 className={styles.title}>Nossa História</h2>

          <p>
            A <strong>Paixão Angola</strong> nasceu oficialmente em 2024,
            com o propósito de transformar visão, disciplina e inovação
            em uma empresa moderna e sólida.
          </p>

          <p>
            Fundada por Wilson dos Santos Kahango Dala, a empresa representa
            mais do que comércio — representa crescimento, tecnologia e
            compromisso com excelência.
          </p>

          <p>
            Hoje, a Paixão continua evoluindo, investindo em inovação,
            experiência do usuário e qualidade no atendimento.
          </p>
        </div>

      </div>
    </div>
  );
}