import { useState } from "react";
import styles from "./OrderCard.module.css";
import { confirmOrder, deliverOrder } from "../api/orders";

export default function OrderCard({ order, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  let status = order.status.toLowerCase().trim();

  const showConfirmButton = status === "paid";
  const showDeliveryButton = status === "confirmed" || status === "ready_for_delivery";

  async function handleConfirm() {
    try {
      setLoading(true);
      setError("");
      await confirmOrder(order.id);
      onUpdate();
    } catch {
      setError("Erro ao confirmar pedido");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelivery() {
    try {
      setLoading(true);
      setError("");
      await deliverOrder(order.id);
      onUpdate();
    } catch {
      setError("Erro ao entregar pedido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${styles.card} ${styles[status]}`}>
      <h3>Pedido #{order.id}</h3>
      <p>Status: {order.status}</p>
      <p>Pagamento: {order.payment_method}</p>
      <p>Total: R$ {order.total}</p>

      {error && <p className={styles.error}>{error}</p>}

      {showConfirmButton && (
        <button onClick={handleConfirm} disabled={loading}>
          {loading ? "Confirmando..." : "Confirmar"}
        </button>
      )}

      {showDeliveryButton && (
        <button onClick={handleDelivery} disabled={loading}>
          {loading ? "Entregando..." : "Entregar"}
        </button>
      )}
    </div>
  );
}
