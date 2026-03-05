import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Instagram, Search } from "lucide-react";
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

function buildProductsUrl(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      qs.set(k, String(v));
    }
  });
  return `/products?${qs.toString()}`;
}

export default function Navbar() {
  const [openMobile, setOpenMobile] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [q, setQ] = useState("");

  const accountRef = useRef(null);
  const productsRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { cart = [] } = useCart();
  const { user, logout } = useAuth();

  const totalItems = useMemo(
    () => (Array.isArray(cart) ? cart : []).reduce((t, i) => t + (Number(i?.quantity) || 0), 0),
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

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

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

  // fecha dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
      if (productsRef.current && !productsRef.current.contains(event.target)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ao navegar, fecha tudo
  useEffect(() => {
    setOpenMobile(false);
    setAccountOpen(false);
    setProductsOpen(false);
  }, [location.pathname, location.search]);

  return (
    <header className={styles.header}>
      {/* ===== TOP BAR (social) ===== */}
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <a
            className={styles.socialLink}
            href="https://instagram.com/paixao.angola2024"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >
            <Instagram size={18} />
          </a>
        </div>
      </div>

      {/* ===== MAIN HEADER (logo + search + actions) ===== */}
      <nav className={styles.navbar}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo} aria-label="Ir para a Home">
            <span className={styles.logoTop}>PAIXÃO</span>
            <span className={styles.logoBottom}>ANGOLA</span>
          </Link>

          <form className={styles.searchWrap} onSubmit={submitSearch}>
            <input
              className={styles.searchInput}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="O que você está procurando?"
              aria-label="Buscar produtos"
            />
            <button className={styles.searchBtn} type="submit" aria-label="Buscar">
              <Search size={18} />
            </button>
          </form>

          <div className={styles.actions}>
            {user ? (
              <>
                <Link to="/cart" className={styles.cart} title="Carrinho">
                  <span className={styles.cartIcon} aria-hidden="true">🛒</span>
                  <span className={styles.cartTotal}>R$ {totalPrice.toFixed(2)}</span>
                  {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
                </Link>

                <div className={styles.account} ref={accountRef}>
                  <button
                    type="button"
                    className={styles.avatarBtn}
                    onClick={() => setAccountOpen((v) => !v)}
                    aria-label="Minha conta"
                    aria-expanded={accountOpen}
                  >
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="Avatar" className={styles.avatarImg} />
                    ) : (
                      <span className={styles.avatarFallback}>{userInitial}</span>
                    )}
                  </button>

                  {accountOpen && (
                    <div className={styles.accountDropdown} role="menu">
                      <div className={styles.userInfo}>
                        <strong className={styles.userName}>{user?.name || "Usuário"}</strong>
                        <small className={styles.userEmail}>{user?.email}</small>
                      </div>

                      <Link className={styles.ddLink} to="/profile">Meu Perfil</Link>
                      {user?.role === "admin" && (
                        <Link className={styles.ddLink} to="/admin">Admin</Link>
                      )}

                      <button className={styles.ddButton} onClick={handleLogout}>
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.btnGhost}>
                  Entrar
                </Link>

                <Link to="/register" className={styles.btnPrimary}>
                  Cadastrar
                </Link>

                <Link to="/cart" className={styles.cart} title="Carrinho">
                  <span className={styles.cartIcon} aria-hidden="true">🛒</span>
                  {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
                </Link>
              </>
            )}

            <button
              type="button"
              className={styles.toggle}
              onClick={() => setOpenMobile((v) => !v)}
              aria-label="Abrir menu"
              aria-expanded={openMobile}
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* ===== CATEGORIES BAR ===== */}
      <div className={styles.menuBar}>
        <div className={styles.menuInner}>
          {/* Produtos dropdown */}
          <div className={styles.products} ref={productsRef}>
            <button
              type="button"
              className={styles.dropdownBtn}
              onClick={() => setProductsOpen((v) => !v)}
              aria-expanded={productsOpen}
            >
              Produtos <span className={styles.caret}>▾</span>
            </button>

            {productsOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.group}>
                  <strong>Roupas</strong>
                  <Link to={buildProductsUrl({ category: "Roupas", subcategory: "Feminino" })} onClick={() => setProductsOpen(false)}>
                    Feminino
                  </Link>
                  <Link to={buildProductsUrl({ category: "Roupas", subcategory: "Masculino" })} onClick={() => setProductsOpen(false)}>
                    Masculino
                  </Link>
                </div>

                <div className={styles.group}>
                  <strong>Beleza</strong>
                  <Link to={buildProductsUrl({ category: "Beleza", subcategory: "Hidratante" })} onClick={() => setProductsOpen(false)}>
                    Hidratante
                  </Link>
                  <Link to={buildProductsUrl({ category: "Beleza", subcategory: "Oleo" })} onClick={() => setProductsOpen(false)}>
                    Óleo
                  </Link>
                  <Link to={buildProductsUrl({ category: "Beleza", subcategory: "Kit" })} onClick={() => setProductsOpen(false)}>
                    Kits
                  </Link>
                </div>

                <div className={styles.group}>
                  <strong>Calçado</strong>
                  <Link to={buildProductsUrl({ category: "Calçado", subcategory: "Masculino" })} onClick={() => setProductsOpen(false)}>
                    Masculino
                  </Link>
                  <Link to={buildProductsUrl({ category: "Calçado", subcategory: "Feminino" })} onClick={() => setProductsOpen(false)}>
                    Feminino
                  </Link>
                </div>

                <div className={styles.group}>
                  <strong>Especiais</strong>
                  <Link to={buildProductsUrl({ is_wholesale: "true" })} onClick={() => setProductsOpen(false)}>
                    Atacado
                  </Link>
                  <Link to={buildProductsUrl({ is_kit: "true" })} onClick={() => setProductsOpen(false)}>
                    Apenas Kits
                  </Link>
                  <Link to="/products" onClick={() => setProductsOpen(false)}>
                    Ver todos
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* links rápidos */}
          {CATEGORIES.map((c) => (
            <Link key={c.label} to={c.to} className={styles.menuLink}>
              {c.label.toUpperCase()}
            </Link>
          ))}

          <Link to="/sobre-nos" className={styles.menuLink}>
            SOBRE NÓS
          </Link>
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      <div className={`${styles.mobileMenu} ${openMobile ? styles.active : ""}`}>
        <Link to="/products">Produtos</Link>
        <Link to="/sobre-nos">Sobre Nós</Link>

        {user && <Link to="/profile">Meu Perfil</Link>}
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}

        {!user && <Link to="/login">Entrar</Link>}
        {!user && <Link to="/register">Cadastrar</Link>}

        {user && (
          <button onClick={handleLogout} className={styles.mobileLogout}>
            Sair
          </button>
        )}
      </div>
    </header>
  );
}