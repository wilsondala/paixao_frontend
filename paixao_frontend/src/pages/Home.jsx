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

        {/* ================= VÍDEO ================= */}
        <section className={styles.videoSection}>
          <h2>Conheça o Kit Paixão</h2>
          <video controls className={styles.video}>
            <source src="/video/nossos kits.mp4" type="video/mp4" />
          </video>
        </section>

        {/* ================= CTA FINAL ================= */}
        <section className={styles.finalCta}>
          <h2>Transforme seus momentos com Paixão</h2>
          <Link to="/products" className={styles.primaryBtn}>
            Comprar Agora
          </Link>
        </section>

      </div>
    </MainLayout>
  );
}