import { Link } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      {/* ================= HERO ================= */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Oferta Especial • Kit Premium</span>

          <h1>Desperte a Intensidade da Paixão</h1>
          <p>Kit exclusivo Creme 200ml + Óleo 100ml</p>

          <div className={styles.priceWrap}>
            <h2 className={styles.price}>Apenas 12.500 Kz</h2>
            <span className={styles.priceSub}>Entrega rápida em Angola</span>
          </div>

          <div className={styles.buttons}>
            <Link to="/products" className={styles.primaryBtn}>
              Comprar Agora
            </Link>

            <a
              href="https://wa.me/244SEUNUMERO"
              target="_blank"
              rel="noreferrer"
              className={styles.whatsappBtn}
            >
              Falar no WhatsApp
            </a>
          </div>

          <div className={styles.trustRow}>
            <span>🔒 Pagamento seguro</span>
            <span>🚚 Entrega rápida</span>
            <span>⭐ Qualidade premium</span>
          </div>
        </div>
      </section>

      {/* ================= BENEFÍCIOS ================= */}
      <section className={styles.benefits}>
        <div className={styles.sectionHead}>
          <h2>Por que escolher Paixão?</h2>
          <p>Qualidade, performance e uma experiência premium do início ao fim.</p>
        </div>

        <div className={styles.benefitGrid}>
          <div className={styles.benefitCard}>
            <h3>🔥 Aroma Envolvente</h3>
            <p>Fragrância marcante que desperta os sentidos.</p>
          </div>

          <div className={styles.benefitCard}>
            <h3>💖 Textura Suave</h3>
            <p>Toque macio e agradável na pele.</p>
          </div>

          <div className={styles.benefitCard}>
            <h3>🚚 Entrega Rápida</h3>
            <p>Distribuição segura em Angola.</p>
          </div>

          <div className={styles.benefitCard}>
            <h3>🔐 Pagamento Seguro</h3>
            <p>Pagamento Expresso ou na entrega.</p>
          </div>
        </div>
      </section>

      {/* ================= ATACADO ================= */}
      <section className={styles.wholesale}>
        <div className={styles.sectionHead}>
          <h2>Opções para Revendedores</h2>
          <p>Condições especiais para atacado com melhor margem.</p>
        </div>

        <div className={styles.wholesaleGrid}>
          <div className={styles.card}>
            <h3>Óleo paixão de 100ml</h3>
            <p>
              <strong className={styles.highlightPrice}>12 unidades</strong> — 66.000 Kz
            </p>
            <p>
              <strong className={styles.highlightPrice}>24 unidades</strong> — 132.000 Kz
            </p>
          </div>

          <div className={styles.card}>
            <h3>Creme paixão de 200ml</h3>
            <p>
              <strong className={styles.highlightPrice}>12 unidades de 200ml </strong> — 54.000 Kz
            </p>
            <p>
              <strong className={styles.highlightPrice}>24 unidades</strong> — 108.000 Kz
            </p>
          </div>
        </div>
      </section>

      {/* ================= VÍDEO 1 ================= */}
      <section className={styles.videoSection}>
        <div className={styles.sectionHead}>
          <h2>Conheça o Kit Paixão</h2>
          <p>Veja como o produto se destaca em textura e presença.</p>
        </div>

        <div className={styles.videoFrame}>
          <video autoPlay loop muted playsInline className={styles.video}>
            <source src="/video/videotodosoleo.mp4" type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>
      </section>

      {/* ================= CTA FINAL (com VÍDEO 2) ================= */}
      <section className={styles.finalCta}>
        <div className={styles.finalInner}>
          <div className={styles.finalText}>
            <h2>Transforme seus momentos com Paixão</h2>
            <p>
              Experiência premium, fragrância marcante e entrega segura.
              Garanta o seu kit hoje.
            </p>
            <Link to="/products" className={styles.primaryBtn}>
              Comprar Agora
            </Link>
          </div>

          <div className={styles.finalVideo}>
            <div className={styles.videoRatio}>
              <video autoPlay loop muted playsInline className={styles.videoCover}>
                <source src="/video/nossoskits.mp4" type="video/mp4" />
                Seu navegador não suporta o elemento de vídeo.
              </video>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}