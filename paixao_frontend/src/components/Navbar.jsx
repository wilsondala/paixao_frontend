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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [productsDropdown, setProductsDropdown] = useState(false);

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

  const avatarSrc = useMemo(
    () => resolveAvatarUrl(user?.photo),
    [user?.photo]
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
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
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <Link to="/">PAIXÃO ANGOLA</Link>
        </div>

        <button
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        <div className={`${styles.links} ${open ? styles.active : ""}`}>
          {/* PRODUTOS */}
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

          {user && (
            <>
              <Link to="/cart" className={styles.cart}>
                🛒
                {totalItems > 0 && (
                  <span className={styles.badge}>{totalItems}</span>
                )}
              </Link>

              <div className={styles.avatarContainer} ref={dropdownRef}>
                <div
                  className={styles.avatar}
                  onClick={() => setDropdown((v) => !v)}
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
                    <button onClick={handleLogout}>Sair</button>
                  </div>
                )}
              </div>
            </>
          )}

          {!user && (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/register" className={styles.registerBtn}>
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}