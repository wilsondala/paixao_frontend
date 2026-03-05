import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import styles from "./Header.module.css";

const CATEGORIES = [
  { label: "Todos os modelos", to: "/products" },
  { label: "Óleos", to: "/products?category=oleo" },
  { label: "Cremes", to: "/products?category=creme" },
  { label: "Kits", to: "/products?category=kit" },
  { label: "Outlet", to: "/products?category=outlet" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");

  const totalItems = useMemo(() => {
    const items = Array.isArray(cart) ? cart : [];
    return items.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    const items = Array.isArray(cart) ? cart : [];
    return items.reduce((sum, item) => {
      const price = Number(item?.price ?? item?.product?.price ?? 0);
      const qty = Number(item?.quantity ?? 1);
      return sum + price * qty;
    }, 0);
  }, [cart]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return navigate("/products");
    navigate(`/products?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className={styles.header}>
      {/* TOPBAR (fina) */}
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <span>ATENDIMENTO VIA CHAT</span>
          <span className={styles.sep}>|</span>
          <span>BAIXE JÁ NOSSO APLICATIVO</span>
          <span className={styles.sep}>|</span>
          <span>RASTREIO</span>

          <a
            className={styles.ig}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
          >
            IG
          </a>
        </div>
      </div>

      {/* BARRA PRINCIPAL (preta) */}
      <div className={styles.mainbar}>
        <div className={styles.mainInner}>
          {/* LOGO */}
          <Link to="/" className={styles.logo}>
            PAIXÃO <span>ANGOLA</span>
          </Link>

          {/* BUSCA */}
          <form className={styles.searchWrap} onSubmit={submitSearch}>
            <input
              className={styles.search}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="O que você está procurando?"
            />
            <button className={styles.searchBtn} type="submit" aria-label="Buscar">
              🔎
            </button>
          </form>

          {/* AÇÕES */}
          <div className={styles.actions}>
            {user ? (
              <Link to="/profile" className={styles.accountLink}>
                👤 <span>MINHA CONTA</span>
              </Link>
            ) : (
              <Link to="/login" className={styles.accountLink}>
                👤 <span>ENTRAR</span>
              </Link>
            )}

            {user?.role === "admin" && (
              <Link to="/admin" className={styles.adminLink}>
                Admin
              </Link>
            )}

            {user && (
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Sair
              </button>
            )}

            <button className={styles.cartBtn} onClick={() => navigate("/cart")}>
              🛒
              <span className={styles.cartTotal}>R$ {totalPrice.toFixed(2)}</span>
              {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
            </button>

            {/* BOTÃO MOBILE */}
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Abrir menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* MENU CATEGORIAS (faixa verde/cinza) */}
      <nav className={`${styles.navbar} ${menuOpen ? styles.open : ""}`}>
        <div className={styles.navInner}>
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className={styles.navItem}
              onClick={() => setMenuOpen(false)}
            >
              {c.label.toUpperCase()}
            </Link>
          ))}

          <Link to="/sobre-nos" className={styles.navItem} onClick={() => setMenuOpen(false)}>
            SOBRE NÓS
          </Link>

          <Link to="/products" className={styles.navItem} onClick={() => setMenuOpen(false)}>
            PRODUTOS
          </Link>
        </div>
      </nav>
    </header>
  );
}