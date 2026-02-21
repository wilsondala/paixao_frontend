import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        
        <div>
          <h4>Empresa</h4>
          <Link to="/sobre-nos" className={styles.link}>
            Sobre Nós
          </Link>
        </div>

        <div>
          <h4>Contato</h4>
          <p>Email: contato@paixaoangola.com</p>
          <p>Telefone: +244 912 345 678</p>
          <p>Luanda - Angola</p>
        </div>

        <div>
          <p>© 2026 Paixão Angola</p>
        </div>

      </div>
    </footer>
  );
}