import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import styles from "./Header.module.css";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>

        {/* LOGO */}
        <Link to="/" className={styles.logo}>
          Paixão
        </Link>

        {/* MENU DESKTOP */}
        <nav className={`${styles.nav} ${menuOpen ? styles.active : ""}`}>
          <Link to="/products">Produtos</Link>
          <Link to="/sobre-nos">Sobre Nós</Link>

          {user && <Link to="/profile">Perfil</Link>}

          {user?.role === "admin" && (
            <Link to="/admin">Admin</Link>
          )}

          {user ? (
            <button onClick={handleLogout} className={styles.logout}>
              Sair
            </button>
          ) : (
            <Link to="/login">Entrar</Link>
          )}
        </nav>

        {/* CARRINHO */}
        <Link to="/cart" className={styles.cart}>
          🛒
          {totalItems > 0 && (
            <span className={styles.badge}>{totalItems}</span>
          )}
        </Link>

        {/* BOTÃO MOBILE */}
        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>
    </header>
  );
}