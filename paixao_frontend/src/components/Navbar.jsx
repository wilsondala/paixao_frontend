import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>PAIXÃO ANGOLA</div>

      <button
        className={styles.toggle}
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      <div className={`${styles.links} ${open ? styles.active : ""}`}>
        <Link to="/products">Produtos</Link>
        <Link to="/profile">Perfil</Link>

        {token && (
          <button className={styles.logout} onClick={handleLogout}>
            Sair
          </button>
        )}
      </div>
    </nav>
  );
}