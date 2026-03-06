import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";
import styles from "./Navbar.module.css";

function resolveAvatarUrl(photo) {
  if (!photo) return null;
  if (/^https?:\/\//i.test(photo)) return photo;

  const API_BASE = "http://127.0.0.1:8000";
  if (photo.startsWith("/")) return `${API_BASE}${photo}`;
  return photo;
}

function normalizeText(value) {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function shouldNavigateToAllProducts(term) {
  const normalized = normalizeText(term);

  const allTerms = new Set([
    "todos",
    "tudo",
    "todo",
    "todas",
    "todos os produtos",
    "todos os modelos",
    "ver tudo",
    "ver todos",
    "mostrar tudo",
    "mostrar todos",
    "all",
    "produtos",
    "modelos",
  ]);

  return allTerms.has(normalized);
}

const QUICK_CATEGORIES = [
  { label: "Todos os Modelos", to: "/products" },
  { label: "Atacado", to: "/products?is_wholesale=true" },
  { label: "Apenas Kits", to: "/products?is_kit=true" },
  { label: "Hidratante", to: "/products?category=Perfumaria&subcategory=Hidratante" },
  { label: "Óleo", to: "/products?category=Perfumaria&subcategory=Óleo" },
  { label: "Roupas", to: "/products?category=Roupas" },
  { label: "Calçados", to: "/products?category=Calçados" },
];

function buildProductsUrl(params = {}) {
  const qs = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      qs.set(key, String(value));
    }
  });

  const query = qs.toString();
  return query ? `/products?${query}` : "/products";
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

  const totalItems = useMemo(() => {
    const items = Array.isArray(cart) ? cart : [];
    return items.reduce((total, item) => total + (Number(item?.quantity) || 0), 0);
  }, [cart]);

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

    if (!term || shouldNavigateToAllProducts(term)) {
      navigate("/products");
      return;
    }

    navigate(`/products?q=${encodeURIComponent(term)}`);
  };

  const handleProductsToggle = () => {
    setProductsOpen((prev) => !prev);
  };

  const handleProductsClose = () => {
    setProductsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }

      if (productsRef.current && !productsRef.current.contains(event.target)) {
        setProductsOpen(false);
      }
    }

    function handleEsc(event) {
      if (event.key === "Escape") {
        setAccountOpen(false);
        setProductsOpen(false);
        setOpenMobile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    setOpenMobile(false);
    setAccountOpen(false);
    setProductsOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentQuery = params.get("q") || "";
    setQ(currentQuery);
  }, [location.search]);

  return (
    <header className={styles.header}>
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
                  <span className={styles.cartIcon} aria-hidden="true">
                    🛒
                  </span>

                  <span className={styles.cartTotal}>
                    R$ {totalPrice.toFixed(2)}
                  </span>

                  {totalItems > 0 && (
                    <span className={styles.badge}>{totalItems}</span>
                  )}
                </Link>

                <div className={styles.account} ref={accountRef}>
                  <button
                    type="button"
                    className={styles.avatarBtn}
                    onClick={() => setAccountOpen((prev) => !prev)}
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
                        <strong className={styles.userName}>
                          {user?.name || "Usuário"}
                        </strong>
                        <small className={styles.userEmail}>{user?.email}</small>
                      </div>

                      <Link className={styles.ddLink} to="/profile">
                        Meu Perfil
                      </Link>

                      {user?.role === "admin" && (
                        <Link className={styles.ddLink} to="/admin">
                          Admin
                        </Link>
                      )}

                      <button
                        type="button"
                        className={styles.ddButton}
                        onClick={handleLogout}
                      >
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
                  <span className={styles.cartIcon} aria-hidden="true">
                    🛒
                  </span>
                  {totalItems > 0 && (
                    <span className={styles.badge}>{totalItems}</span>
                  )}
                </Link>
              </>
            )}

            <button
              type="button"
              className={styles.toggle}
              onClick={() => setOpenMobile((prev) => !prev)}
              aria-label="Abrir menu"
              aria-expanded={openMobile}
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.menuBar}>
        <div className={styles.menuInner}>
          <div className={styles.productsDropdown} ref={productsRef}>
            <button
              type="button"
              className={`${styles.dropdownBtn} ${
                productsOpen ? styles.dropdownBtnActive : ""
              }`}
              onClick={handleProductsToggle}
              aria-expanded={productsOpen}
              aria-haspopup="true"
            >
              <span>Produtos</span>
              <span
                className={`${styles.caret} ${
                  productsOpen ? styles.caretOpen : ""
                }`}
              >
                ▾
              </span>
            </button>

            {productsOpen && (
              <div className={styles.dropdownMenu}>
                <Link
                  className={styles.dropdownItem}
                  to="/products"
                  onClick={handleProductsClose}
                >
                  Todos os modelos
                </Link>

                <Link
                  className={styles.dropdownItem}
                  to={buildProductsUrl({ is_wholesale: "true" })}
                  onClick={handleProductsClose}
                >
                  Atacado
                </Link>

                <Link
                  className={styles.dropdownItem}
                  to={buildProductsUrl({ is_kit: "true" })}
                  onClick={handleProductsClose}
                >
                  Apenas Kits
                </Link>

                <Link
                  className={styles.dropdownItem}
                  to={buildProductsUrl({
                    category: "Perfumaria",
                    subcategory: "Hidratante",
                  })}
                  onClick={handleProductsClose}
                >
                  Hidratante
                </Link>

                <Link
                  className={styles.dropdownItem}
                  to={buildProductsUrl({
                    category: "Perfumaria",
                    subcategory: "Óleo",
                  })}
                  onClick={handleProductsClose}
                >
                  Óleo
                </Link>

                <Link
                  className={styles.dropdownItem}
                  to={buildProductsUrl({ category: "Roupas" })}
                  onClick={handleProductsClose}
                >
                  Roupas
                </Link>

                <Link
                  className={styles.dropdownItem}
                  to={buildProductsUrl({ category: "Calçados" })}
                  onClick={handleProductsClose}
                >
                  Calçados
                </Link>
              </div>
            )}
          </div>

          <div className={styles.menuLinks}>
            {QUICK_CATEGORIES.map((category) => (
              <Link
                key={category.label}
                to={category.to}
                className={styles.menuLink}
              >
                {category.label.toUpperCase()}
              </Link>
            ))}

            <Link to="/sobre-nos" className={styles.menuLink}>
              SOBRE NÓS
            </Link>
          </div>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${openMobile ? styles.active : ""}`}>
        <Link to="/products">Todos os Produtos</Link>
        <Link to={buildProductsUrl({ is_wholesale: "true" })}>Atacado</Link>
        <Link to={buildProductsUrl({ is_kit: "true" })}>Apenas Kits</Link>
        <Link
          to={buildProductsUrl({
            category: "Perfumaria",
            subcategory: "Hidratante",
          })}
        >
          Hidratante
        </Link>
        <Link
          to={buildProductsUrl({
            category: "Perfumaria",
            subcategory: "Óleo",
          })}
        >
          Óleo
        </Link>
        <Link to={buildProductsUrl({ category: "Roupas" })}>Roupas</Link>
        <Link to={buildProductsUrl({ category: "Calçados" })}>Calçados</Link>
        <Link to="/sobre-nos">Sobre Nós</Link>

        {user && <Link to="/profile">Meu Perfil</Link>}
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}

        {!user && <Link to="/login">Entrar</Link>}
        {!user && <Link to="/register">Cadastrar</Link>}

        {user && (
          <button type="button" onClick={handleLogout} className={styles.mobileLogout}>
            Sair
          </button>
        )}
      </div>
    </header>
  );
}