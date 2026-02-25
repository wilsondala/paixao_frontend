import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
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

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
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
        <Link to="/products" onClick={() => setOpen(false)}>
          Produtos
        </Link>

        {user && (
          <>
            <Link
              to="/cart"
              className={styles.cart}
              onClick={() => setOpen(false)}
            >
              🛒
              {totalItems > 0 && (
                <span className={styles.badge}>
                  {totalItems}
                </span>
              )}
            </Link>

            {/* AVATAR */}
            <div
              className={styles.avatarContainer}
              ref={dropdownRef}
            >
              <div
                className={styles.avatar}
                onClick={() => setDropdown(!dropdown)}
              >
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt="Avatar"
                    className={styles.avatarImg}
                  />
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

                  <Link
                    to="/profile"
                    onClick={() => setDropdown(false)}
                  >
                    Meu Perfil
                  </Link>

                  <button onClick={handleLogout}>
                    Sair
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {!user && (
          <Link to="/login" onClick={() => setOpen(false)}>
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}