import { Link } from "react-router-dom";
import styles from "./ProductLayout.module.css";

export default function ProductLayout({ children }) {
  return (
    <div className={styles.container}>
      {/* Menu / Navbar */}
      <header className={styles.header}>
        <div className={styles.logo}>PAIXÃO ANGOLA</div>
        <nav>
          <Link to="/login">Entrar</Link>
          <Link to="/register">Registrar</Link>
        </nav>
      </header>

      {/* Conteúdo principal */}
      <main className={styles.main}>{children}</main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2026 Paixão Angola</p>
          <p>Email: contato@paixaoangola.com</p>
          <p>Telefone: +244 912 345 678</p>
          <p>Endereço: Rua Exemplo, Luanda, Angola</p>
        </div>
      </footer>
    </div>
  );
}