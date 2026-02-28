import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [productsDropdown, setProductsDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { cartItems = [] } = useCart();
  const { user, logout } = useAuth();

  const totalItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fecha dropdown ao clicar fora (avatar e também produtos)
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">PAIXÃO ANGOLA</Link>
      </div>

      <button
        className={styles.toggle}
        onClick={() => setOpen(!open)}
        aria-label="Abrir menu"
      >
        ☰
      </button>

      <div className={`${styles.links} ${open ? styles.active : ""}`}>
        {/* MENU PRODUTOS (category + subcategory + atacado/kit) */}
        <div className={styles.productsContainer}>
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
                <Link
                  to="/products?category=Roupas&subcategory=Feminino"
                  onClick={() => {
                    setProductsDropdown(false);
                    setOpen(false);
                  }}
                >
                  Feminino
                </Link>
                <Link
                  to="/products?category=Roupas&subcategory=Masculino"
                  onClick={() => {
                    setProductsDropdown(false);
                    setOpen(false);
                  }}
                >
                  Masculino
                </Link>
              </div>

              <div className={styles.categoryGroup}>
                <strong>Beleza</strong>
                <Link
                  to="/products?category=Beleza&subcategory=Hidratante"
                  onClick={() => {
                    setProductsDropdown(false);
                    setOpen(false);
                  }}
                >
                  Hidratante
                </Link>
                <Link
                  to="/products?category=Beleza&subcategory=Óleo"
                  onClick={() => {
                    setProductsDropdown(false);
                    setOpen(false);
                  }}
                >
                  Óleo
                </Link>
                <Link
                  to="/products?category=Beleza&subcategory=Kit"
                  onClick={() => {
                    setProductsDropdown(false);
                    setOpen(false);
                  }}
                >
                  Kits
                </Link>
              </div>

              <div className={styles.categoryGroup}>
                <strong>Calçado</strong>
                <Link
                  to="/products?category=Calçado&subcategory=Masculino"
                  onClick={() => {
                    setProductsDropdown(false);
                    setOpen(false);
                  }}
                >
                  Masculino
                </Link>
                <Link
                  to="/products?category=Calçado&subcategory=Feminino"
                  onClick={() => {
                    setProductsDropdown(false);
                    setOpen(false);
                  }}
                >
                  Feminino
                </Link>
              </div>

              <div className={styles.categoryGroup}>
                <strong>Especiais</strong>
                <Link
                  to="/products?is_wholesale=true"
                  onClick={() => {
                    setProductsDropdown(false);
                    setOpen(false);
                  }}
                >
                  Atacado
                </Link>
                <Link
                  to="/products?is_kit=true"
                  onClick={() => {
                    setProductsDropdown(false);
                    setOpen(false);
                  }}
                >
                  Apenas Kits
                </Link>
                <Link
                  to="/products"
                  onClick={() => {
                    setProductsDropdown(false);
                    setOpen(false);
                  }}
                >
                  Ver todos
                </Link>
              </div>
            </div>
          )}
        </div>

        {user && (
          <>
            <Link to="/cart" className={styles.cart} onClick={() => setOpen(false)}>
              🛒
              {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
            </Link>

            {/* AVATAR */}
            <div className={styles.avatarContainer} ref={dropdownRef}>
              <div className={styles.avatar} onClick={() => setDropdown(!dropdown)}>
                {user.photo ? (
                  <img src={user.photo} alt="Avatar" className={styles.avatarImg} />
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

                  <Link to="/profile" onClick={() => setDropdown(false)}>
                    Meu Perfil
                  </Link>

                  <button onClick={handleLogout}>Sair</button>
                </div>
              )}
            </div>
          </>
        )}

        {!user && (
          <>
            <Link to="/login" onClick={() => setOpen(false)}>
              Entrar
            </Link>

            <Link
              to="/register"
              className={styles.registerBtn}
              onClick={() => setOpen(false)}
            >
              Cadastrar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}