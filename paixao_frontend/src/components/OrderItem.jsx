import { useState } from "react";
import { confirmOrder, chooseDelivery } from "../api/orders";
import styles from "./OrderItem.module.css";

export default function OrderItem({ order, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      await confirmOrder(order.id);
      onUpdate();
    } catch {
      setError("Erro ao confirmar pedido");
    } finally {
      setLoading(false);
    }
  };

  const handleDelivery = async () => {
    setLoading(true);
    setError("");
    try {
      await chooseDelivery(order.id, "entrega");
      onUpdate();
    } catch {
      setError("Erro ao escolher entrega");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.orderId}>Pedido #{order.id}</div>
        <div className={`${styles.status} ${styles[order.status]}`}>
          {order.status}
        </div>
      </div>

      <div className={styles.info}>
        <p><strong>Status:</strong> {order.status}</p>
        <p className={styles.total}>Total: {order.total_amount} Kz</p>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {order.status === "pending" && (
        <button
          className={`${styles.button} ${styles.confirm}`}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Confirmando..." : "Confirmar pedido"}
        </button>
      )}

      {order.status === "confirmed" && (
        <button
          className={`${styles.button} ${styles.delivery}`}
          onClick={handleDelivery}
          disabled={loading}
        >
          {loading ? "Processando..." : "Escolher entrega"}
        </button>
      )}

      {order.status === "ready_for_delivery" && (
        <p style={{ color: "green", fontWeight: "600", marginTop: "12px" }}>
          Pedido pronto para entrega 🚚
        </p>
      )}
    </div>
  );
}