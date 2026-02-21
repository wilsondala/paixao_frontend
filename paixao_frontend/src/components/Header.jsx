import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Header.module.css";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo}>
          <img
            src="/imagem/logo.png"
            alt="Paixão Angola"
            className={styles.logoImage}
          />
        </Link>

        <nav className={styles.nav}>
          {!user ? (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/register">Registrar</Link>
            </>
          ) : (
            <>
              <span className={styles.userName}>
                Olá, {user.name || user.email}
              </span>
              <Link to="/perfil">Perfil</Link>
              <button onClick={logout} className={styles.logoutBtn}>
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}