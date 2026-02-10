import { useEffect, useState } from "react";
import { getOrders } from "../api/orders";
import OrderCard from "./OrderCard";
import styles from "./OrderList.module.css";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data.sort((a, b) => b.id - a.id));
    } catch {
      setError("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status.toLowerCase().trim() === filter);

  const statusColors = [
    { label: "Pago", color: "paid" },
    { label: "Confirmado", color: "confirmed" },
    { label: "Pronto para entrega", color: "ready_for_delivery" },
    { label: "Enviado", color: "sent" },
  ];

  if (loading) return <p>Carregando pedidos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {/* Filtro */}
      <div className={styles.filter}>
        <label>Status: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Todos</option>
          <option value="paid">Pago</option>
          <option value="confirmed">Confirmado</option>
          <option value="ready_for_delivery">Pronto para entrega</option>
          <option value="sent">Enviado</option>
        </select>
      </div>

      {/* Legenda de cores */}
      <div className={styles.legend}>
        {statusColors.map((s) => (
          <div key={s.color} className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles[s.color]}`}></span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Grid de pedidos */}
      <div className={styles.grid}>
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} onUpdate={loadOrders} />
        ))}
      </div>
    </div>
  );
}
