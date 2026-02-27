import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADICIONADO
import { getDashboard } from "../api/admin";
import UsersTable from "../components/UsersTable";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ ADICIONADO

  // ✅ FUNÇÃO LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await getDashboard();
        setDashboardData(response);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    const token = localStorage.getItem("token");
    console.log("Token atual:", token);

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Carregando painel...</div>;
  }

  if (!dashboardData) {
    return (
      <div className={styles.error}>
        Erro ao carregar dados do painel.
      </div>
    );
  }

  const {
    total_users,
    total_orders,
    total_products,
    delivered_orders,
    pending_orders,
    total_revenue,
    users,
  } = dashboardData;

  return (
    <div className={styles.container}>
      
      {/* HEADER COM BOTÃO SAIR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className={styles.title}>Painel Administrativo</h1>
        <button onClick={handleLogout} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Sair
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <div className={styles.cards}>
        <DashboardCard title="Usuários" value={total_users} />
        <DashboardCard title="Pedidos" value={total_orders} />
        <DashboardCard title="Produtos" value={total_products} />
        <DashboardCard title="Entregues" value={delivered_orders} />
        <DashboardCard title="Pendentes" value={pending_orders} />
        <DashboardCard
          title="Receita Total"
          value={`R$ ${Number(total_revenue || 0).toFixed(2)}`}
          highlight
        />
      </div>

      {/* TABELA DE USUÁRIOS */}
      <div className={styles.tableSection}>
        <h2 className={styles.subtitle}>Lista de Usuários</h2>
        <UsersTable users={users} />
      </div>
    </div>
  );
}

/* COMPONENTE DE CARD */
function DashboardCard({ title, value, highlight }) {
  return (
    <div className={`${styles.card} ${highlight ? styles.highlight : ""}`}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardValue}>{value}</p>
    </div>
  );
}