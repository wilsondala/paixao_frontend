import { useEffect, useState } from "react";
import { getDashboard } from "../api/admin";
import styles from "./AdminDashboard.module.css";
import UsersTable from "../components/UsersTable";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await getDashboard();
        setData(result);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      }
    }
    load();
  }, []);

  if (!data) return <p className={styles.loading}>Carregando painel...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Painel Administrativo</h1>

      {/* Cards do Dashboard */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Usuários</h3>
          <p>{data.total_users}</p>
        </div>
        <div className={styles.card}>
          <h3>Pedidos</h3>
          <p>{data.total_orders}</p>
        </div>
        <div className={styles.card}>
          <h3>Produtos</h3>
          <p>{data.total_products}</p>
        </div>
        <div className={styles.card}>
          <h3>Entregues</h3>
          <p>{data.delivered_orders}</p>
        </div>
        <div className={styles.card}>
          <h3>Pendentes</h3>
          <p>{data.pending_orders}</p>
        </div>
        <div className={styles.card}>
          <h3>Receita Total</h3>
          <p>R$ {data.total_revenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabela Premium de Usuários */}
      <UsersTable />
    </div>
  );
}
