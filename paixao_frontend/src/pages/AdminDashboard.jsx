import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../api/admin";
import UsersTable from "../components/UsersTable";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  } = dashboardData;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.dashboardBox}>

        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Painel Administrativo</h1>
            <p className={styles.subtitle}>
              Controle completo da plataforma
            </p>
          </div>

          <button
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Sair
          </button>
        </div>

        {/* CARDS */}
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

        {/* TABELA */}
        <div className={styles.tableCard}>
          <h2>Lista de Usuários</h2>
          <UsersTable />   {/* ✅ CORRIGIDO AQUI */}
        </div>

      </div>
    </div>
  );
}

function DashboardCard({ title, value, highlight }) {
  return (
    <div className={`${styles.card} ${highlight ? styles.highlight : ""}`}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardValue}>{value}</p>
    </div>
  );
}