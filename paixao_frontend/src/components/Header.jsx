import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Header.module.css";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        
        {/* LOGO */}
        <Link to="/" className={styles.logo}>
          <img src="/imagem/logo.png" alt="Paixão Angola" />
          <span>Paixão Angola</span>
        </Link>

        {/* BARRA DE BUSCA COM SELECT */}
        <div className={styles.searchWrapper}>
          <select className={styles.categorySelect}>
            <option value="">Todos os Produtos</option>
            <option value="oleos">Óleos Corporais</option>
            <option value="locoes">Loções Hidratantes</option>
            <option value="kits">Kits Especiais</option>
            <option value="framboesa">Framboesa Negra</option>
            <option value="avelã">Avelã</option>
          </select>

          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Buscar produtos..."
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>🔍</button>
          </div>
        </div>

        {/* DIREITA */}
        <div className={styles.rightSection}>
          <div className={styles.icon}>🛎️</div>
          <div className={styles.icon}>❔</div>
          <div className={styles.language}>🇧🇷 Português</div>

          {!user ? (
            <>
              <Link to="/register" className={styles.link}>Cadastrar</Link>
              <Link to="/login" className={styles.loginBtn}>Entrar</Link>
            </>
          ) : (
            <>
              <span className={styles.user}>Olá, {user.name || "Usuário"}</span>
              <button onClick={logout} className={styles.logoutBtn}>SAIR</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}