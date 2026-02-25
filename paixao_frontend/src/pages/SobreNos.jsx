import React from "react";
import styles from "./SobreNos.module.css";
import MainLayout from "../layouts/MainLayout";

export default function SobreNos() {
  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.content}>

          {/* ================= IMAGEM ================= */}
          <div className={styles.imageSection}>
            <div className={styles.imageGlow}></div>
            <img
              src="/imagem/produtos/wilson.jpg"
              alt="Wilson dos Santos Kahango Dala - Fundador da Paixão Angola"
              className={styles.image}
            />
          </div>

          {/* ================= TEXTO ================= */}
          <div className={styles.textSection}>
            <span className={styles.badge}>Fundador & CEO</span>

            <h1 className={styles.name}>
              Wilson dos Santos Kahango Dala
            </h1>

            <h2 className={styles.subtitle}>
              Transformando visão em inovação
            </h2>

            <p>
              A <strong>Paixão Angola</strong> nasceu em 2024 com um propósito claro:
              construir uma marca moderna, sólida e orientada para o futuro.
              Mais do que vender produtos, a empresa foi criada para oferecer
              experiência, qualidade e conexão com o cliente.
            </p>

            <p>
              Fundada por Wilson dos Santos Kahango Dala, a Paixão representa
              disciplina, visão estratégica e compromisso com excelência.
              Cada detalhe — do atendimento à tecnologia utilizada —
              reflete a busca constante por evolução e inovação.
            </p>

            <p>
              Acreditamos que marcas fortes não são construídas apenas com
              produtos, mas com propósito. Por isso, investimos continuamente
              em tecnologia, experiência do usuário e melhoria de processos,
              criando um ecossistema preparado para crescer de forma
              sustentável e escalável.
            </p>

            <div className={styles.values}>
              <div>
                <h4>Missão</h4>
                <p>Oferecer produtos de qualidade com excelência no atendimento.</p>
              </div>

              <div>
                <h4>Visão</h4>
                <p>Tornar-se referência em inovação e experiência digital.</p>
              </div>

              <div>
                <h4>Valores</h4>
                <p>Disciplina, transparência, evolução e compromisso.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}