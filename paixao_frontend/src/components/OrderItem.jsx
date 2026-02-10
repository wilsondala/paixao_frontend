import { useState } from "react";
import { confirmOrder, chooseDelivery } from "../services/orders";
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

  <div className={`${styles.card} ${styles[order.status]}`}></div>

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 12,
        marginBottom: 10,
        borderRadius: 6,
      }}
    >
      <p>
        <strong>Pedido #{order.id}</strong>
      </p>

      <p>Status: {order.status}</p>
      <p>Total: {order.total_amount}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {order.status === "pending" && (
        <button onClick={handleConfirm} disabled={loading}>
          {loading ? "Confirmando..." : "Confirmar pedido"}
        </button>
      )}

      {order.status === "confirmed" && (
        <button onClick={handleDelivery} disabled={loading}>
          {loading ? "Processando..." : "Escolher entrega"}
        </button>
      )}

      {order.status === "ready_for_delivery" && (
        <p style={{ color: "green" }}>Pedido pronto para entrega 🚚</p>
      )}
    </div>
  );
}
