import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";

function resolveAvatarUrl(photo) {
  if (!photo) return null;
  if (/^https?:\/\//i.test(photo)) return photo;

  const API_BASE = "http://127.0.0.1:8000";
  if (photo.startsWith("/")) return `${API_BASE}${photo}`;
  return photo;
}

const CATEGORIES = [
  { label: "Todos os modelos", to: "/products" },
  { label: "Atacado", to: "/products?is_wholesale=true" },
  { label: "Apenas Kits", to: "/products?is_kit=true" },
  { label: "Hidratante", to: "/products?category=Beleza&subcategory=Hidratante" },
  { label: "Óleo", to: "/products?category=Beleza&subcategory=Óleo" },
  { label: "Roupas", to: "/products?category=Roupas" },
  { label: "Calçado", to: "/products?category=Calçado" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [productsDropdown, setProductsDropdown] = useState(false);
  const [q, setQ] = useState("");

  const dropdownRef = useRef(null);
  const productsRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { cart = [] } = useCart();
  const { user, logout } = useAuth();

  const totalItems = useMemo(
    () => cart.reduce((t, i) => t + (i.quantity || 0), 0),
    [cart]
  );

  const totalPrice = useMemo(() => {
    const items = Array.isArray(cart) ? cart : [];
    return items.reduce((sum, item) => {
      const price = Number(item?.price ?? item?.product?.price ?? 0);
      const qty = Number(item?.quantity ?? 1);
      return sum + price * qty;
    }, 0);
  }, [cart]);

  const avatarSrc = useMemo(() => resolveAvatarUrl(user?.photo), [user?.photo]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return navigate("/products");
    navigate(`/products?q=${encodeURIComponent(term)}`);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
      if (productsRef.current && !productsRef.current.contains(event.target)) {
        setProductsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdown(false);
    setProductsDropdown(false);
  }, [location.pathname, location.search]);

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <header className={styles.header}>
      {/* ===== TOPBAR ===== */}
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

      {/* ===== MAINBAR (logo + busca + ações) ===== */}
      <nav className={styles.navbar}>
        <div className={styles.inner}>
          <div className={styles.logo}>
            <Link to="/">
              PAIXÃO <span>ANGOLA</span>
            </Link>
          </div>

          {/* BUSCA (igual modelo) */}
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

          {/* AÇÕES (conta / carrinho / menu mobile) */}
          <div className={styles.actions}>
            {user ? (
              <>
                <Link to="/cart" className={styles.cart} title="Carrinho">
                  🛒
                  <span className={styles.cartTotal}>R$ {totalPrice.toFixed(2)}</span>
                  {totalItems > 0 && (
                    <span className={styles.badge}>{totalItems}</span>
                  )}
                </Link>

                <div className={styles.avatarContainer} ref={dropdownRef}>
                  <div
                    className={styles.avatar}
                    onClick={() => setDropdown((v) => !v)}
                    title="Minha conta"
                    role="button"
                    tabIndex={0}
                  >
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="Avatar" className={styles.avatarImg} />
                    ) : (
                      userInitial
                    )}
                  </div>

                  {dropdown && (
                    <div className={styles.dropdown}>
                      <div className={styles.userInfo}>
                        <strong>{user.name}</strong>
                        <small>{user.email}</small>
                      </div>

                      <Link to="/profile">Meu Perfil</Link>

                      {user?.role === "admin" && (
                        <Link to="/admin">Admin</Link>
                      )}

                      <button onClick={handleLogout}>Sair</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.linkBtn}>
                  Entrar
                </Link>

                <Link to="/register" className={styles.registerBtn}>
                  Cadastrar
                </Link>

                <Link to="/cart" className={styles.cart} title="Carrinho">
                  🛒
                  {totalItems > 0 && (
                    <span className={styles.badge}>{totalItems}</span>
                  )}
                </Link>
              </>
            )}

            <button
              className={styles.toggle}
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir menu"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* ===== CATEGORIES BAR ===== */}
      <div className={styles.categoriesBar}>
        <div className={styles.categoriesInner}>
          {/* PRODUTOS dropdown (mantido) */}
          <div className={styles.productsContainer} ref={productsRef}>
            <button
              type="button"
              className={styles.productsButton}
              onClick={() => setProductsDropdown((v) => !v)}
            >
              Produtos ▾
            </button>

            {productsDropdown && (
              <div className={styles.productsDropdown}>
                <div className={styles.categoryGroup}>
                  <strong>Roupas</strong>
                  <Link to="/products?category=Roupas&subcategory=Feminino">Feminino</Link>
                  <Link to="/products?category=Roupas&subcategory=Masculino">Masculino</Link>
                </div>

                <div className={styles.categoryGroup}>
                  <strong>Beleza</strong>
                  <Link to="/products?category=Beleza&subcategory=Hidratante">Hidratante</Link>
                  <Link to="/products?category=Beleza&subcategory=Óleo">Óleo</Link>
                  <Link to="/products?category=Beleza&subcategory=Kit">Kits</Link>
                </div>

                <div className={styles.categoryGroup}>
                  <strong>Calçado</strong>
                  <Link to="/products?category=Calçado&subcategory=Masculino">Masculino</Link>
                  <Link to="/products?category=Calçado&subcategory=Feminino">Feminino</Link>
                </div>

                <div className={styles.categoryGroup}>
                  <strong>Especiais</strong>
                  <Link to="/products?is_wholesale=true">Atacado</Link>
                  <Link to="/products?is_kit=true">Apenas Kits</Link>
                  <Link to="/products">Ver todos</Link>
                </div>
              </div>
            )}
          </div>

          {/* categorias rápidas (faixa) */}
          {CATEGORIES.map((c) => (
            <Link key={c.label} to={c.to} className={styles.catLink}>
              {c.label.toUpperCase()}
            </Link>
          ))}

          <Link to="/sobre-nos" className={styles.catLink}>
            SOBRE NÓS
          </Link>
        </div>
      </div>

      {/* ===== MOBILE MENU (reaproveita links) ===== */}
      <div className={`${styles.mobileMenu} ${open ? styles.active : ""}`}>
        <Link to="/products" onClick={() => setOpen(false)}>Produtos</Link>
        <Link to="/sobre-nos" onClick={() => setOpen(false)}>Sobre Nós</Link>
        {user && <Link to="/profile" onClick={() => setOpen(false)}>Meu Perfil</Link>}
        {user?.role === "admin" && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}
        {!user && <Link to="/login" onClick={() => setOpen(false)}>Entrar</Link>}
        {!user && <Link to="/register" onClick={() => setOpen(false)}>Cadastrar</Link>}
        {user && <button onClick={handleLogout} className={styles.mobileLogout}>Sair</button>}
      </div>
    </header>
  );
}