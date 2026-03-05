import { Link } from "react-router-dom";
import { Instagram, Mail, Phone } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* ✅ faixa links (estilo print) */}
      <div className={styles.linksBar}>
        <div className={styles.linksInner}>
          <Link to="/envios">Envios</Link>
          <Link to="/pagamento">Pagamento</Link>
          <Link to="/trocas">Trocas e Devoluções</Link>
          <Link to="/sobre-nos">Sobre Nós</Link>
          <Link to="/products">Produtos</Link>
          <Link to="/privacidade">Privacidade</Link>
          <Link to="/termos">Termo de Compra</Link>
        </div>
      </div>

      {/* ✅ bloco principal */}
      <div className={styles.main}>
        <div className={styles.container}>
          {/* EMPRESA */}
          <div className={styles.column}>
            <h3>Paixão Angola</h3>
            <p>
              Experiência premium do início ao fim: qualidade, confiança e entrega segura.
            </p>
          </div>

          {/* CONTATO */}
          <div className={styles.column}>
            <h4>Contato</h4>

            <div className={styles.iconItem}>
              <Mail size={18} />
              <span>contato@paixaoangola.com</span>
            </div>

            <div className={styles.iconItem}>
              <Phone size={18} />
              <span>+244 912 345 678</span>
            </div>
          </div>

          {/* SOCIAL */}
          <div className={styles.column}>
            <h4>Redes Sociais</h4>
            <div className={styles.socials}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.notice}>
          ⏱ Não temos atendimento presencial. Atendimento online: WhatsApp ou Instagram •
          Seg–Sex 10:00 às 16:00
        </div>

        <div className={styles.bottom}>
          © {new Date().getFullYear()} Paixão Angola. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}