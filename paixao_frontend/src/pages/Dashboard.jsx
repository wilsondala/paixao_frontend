import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>

        <button
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>

      <div className={styles.orderWrapper}>
        {/* conteúdo */}
      </div>
    </div>
  );
}
console.log("DASHBOARD PUBLICO RENDERIZADO");