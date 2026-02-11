import { useAuth } from "../context/AuthContext";
import OrderList from "../components/OrderList";
import styles from "./Dashboard.module.css"; // ✅ CSS atualizado

export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <button className={styles.logoutButton} onClick={logout}>
          Sair
        </button>
      </div>

      <div className={styles["order-wrapper"]}>
        <OrderList /> {/* 🔹 scroll horizontal ativado */}
      </div>
    </div>
  );
}
