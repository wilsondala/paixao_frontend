import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OrderCard.module.css";
import { confirmOrder, deliverOrder } from "../api/orders";

export default function OrderCard({ order, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!order) return null;

  const status = order.status?.toLowerCase().trim();

  function handleCardClick() {
    navigate(`/orders/${order.id}`);
  }

  async function handleConfirm(e) {
    e.stopPropagation(); // 🔥 impede navegação
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

  async function handleDeliver(e) {
    e.stopPropagation(); // 🔥 impede navegação
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
    <div
      className={`${styles.card} ${styles[status]}`}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <h3>Pedido #{order.id}</h3>

      <p>
        <strong>Status:</strong> {order.status}
      </p>

      <p>
        <strong>Pagamento:</strong> {order.payment_method}
      </p>

      <p>
        <strong>Total:</strong> R$ {order.total}
      </p>

      {error && <p className={styles.error}>{error}</p>}

      {status === "paid" && (
        <button onClick={handleConfirm} disabled={loading}>
          {loading ? "Confirmando..." : "Confirmar"}
        </button>
      )}

      {status === "confirmed" && (
        <button onClick={handleDeliver} disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      )}
    </div>
  );
}
