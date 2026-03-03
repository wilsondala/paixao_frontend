import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
} from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* EMPRESA */}
        <div className={styles.column}>
          <h3>Paixão Angola</h3>
          <p>
            Transformando visão em inovação. Uma empresa moderna,
            focada em tecnologia e excelência.
          </p>
        </div>

        {/* LINKS */}
        <div className={styles.column}>
          <h4>Empresa</h4>
          <Link to="/sobre-nos">Sobre Nós</Link>
          <Link to="/products">Produtos</Link>
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

        {/* REDES SOCIAIS */}
        <div className={styles.column}>
          <h4>Redes Sociais</h4>

          <div className={styles.socials}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={20} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={20} />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={20} />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube size={20} />
            </a>
          </div>
        </div>

      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} Paixão Angola. Todos os direitos reservados.
      </div>
    </footer>
  );
}