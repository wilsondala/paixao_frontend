import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <MainLayout>
      <div className={styles.home}>

        {/* ================= HERO ================= */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Desperte a Intensidade da Paixão</h1>
            <p>
              Kit exclusivo Creme 200ml + Óleo 100ml
            </p>
            <h2 className={styles.price}>Apenas 12.500 Kz</h2>

            <div className={styles.buttons}>
              <Link to="/products" className={styles.primaryBtn}>
                Comprar Agora
              </Link>

              <a
                href="https://wa.me/244SEUNUMERO"
                target="_blank"
                className={styles.whatsappBtn}
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ================= BENEFÍCIOS ================= */}
        <section className={styles.benefits}>
          <h2>Por que escolher Paixão?</h2>

          <div className={styles.benefitGrid}>
            <div>
              <h3>🔥 Aroma Envolvente</h3>
              <p>Fragrância marcante que desperta os sentidos.</p>
            </div>

            <div>
              <h3>💖 Textura Suave</h3>
              <p>Toque macio e agradável na pele.</p>
            </div>

            <div>
              <h3>🚚 Entrega Rápida</h3>
              <p>Distribuição segura em Angola.</p>
            </div>

            <div>
              <h3>🔐 Pagamento Seguro</h3>
              <p>Pagamento Expresso ou na entrega.</p>
            </div>
          </div>
        </section>

        {/* ================= ATACADO ================= */}
        <section className={styles.wholesale}>
          <h2>Opções para Revendedores</h2>

          <div className={styles.wholesaleGrid}>
            <div className={styles.card}>
              <h3>Óleo 100ml</h3>
              <p>12 unidades - 72.000 Kz</p>
              <p>24 unidades - 144.000 Kz</p>
            </div>

            <div className={styles.card}>
              <h3>Creme 200ml</h3>
              <p>12 unidades - 60.000 Kz</p>
              <p>24 unidades - 120.000 Kz</p>
            </div>
          </div>
        </section>

        {/* ================= VÍDEO 1 - Conheça o Kit Paixão (sem controles - tipo fundo) ================= */}
        <section className={styles.videoSection}>
          <h2>Conheça o Kit Paixão</h2>
          <video
            autoPlay
            loop
            muted
            playsInline
            className={styles.video}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
          >
            <source src="/video/videotodosoleo.mp4" type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </section>

        {/* ================= CTA FINAL (com VÍDEO 2 - Publicitário sem controles) ================= */}
        <section className={styles.finalCta}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2.5rem",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {/* Texto + Botão */}
            <div style={{ flex: "1 1 320px", minWidth: "280px" }}>
              <h2 style={{ marginBottom: "1.5rem" }}>
                Transforme seus momentos com Paixão
              </h2>
              <Link to="/products" className={styles.primaryBtn}>
                Comprar Agora
              </Link>
            </div>

            {/* Vídeo Publicitário - SEM CONTROLES + LOOP + MUDO + AUTOPLAY */}
            <div
              style={{
                flex: "1 1 420px",
                maxWidth: "520px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%", // 16:9
                  height: 0,
                  overflow: "hidden",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              >
                <iframe
                  src="https://streamable.com/e/pzh5yb?autoplay=1&loop=1&muted=1&nocontrols=1"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay"
                  title="Vídeo Publicitário Paixão"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}