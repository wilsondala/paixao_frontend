import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderById,
  confirmOrder,
  updateItemStatus,
} from "../api/orders";

import styles from "./OrderDetails.module.css";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadOrder() {
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error("Erro ao carregar pedido:", err);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (!order) return <div className={styles.loading}>Carregando pedido...</div>;

  const status = order.status?.toLowerCase();

  async function handleConfirm() {
    setLoading(true);
    await confirmOrder(order.id);
    await loadOrder();
    setLoading(false);
  }

  async function handleItemStatusChange(itemId, newStatus) {
    try {
      setLoading(true);
      await updateItemStatus(itemId, newStatus);
      await loadOrder();
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
    } finally {
      setLoading(false);
    }
  }

  const timelineSteps = ["pending", "confirmed", "sent", "canceled"];

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Voltar
      </button>

      <h2 className={styles.title}>Pedido #{order.id}</h2>

      <div className={`${styles.status} ${styles[status]}`}>
        {order.status}
      </div>

      {/* TIMELINE */}
      <div className={styles.timeline}>
        {timelineSteps.map((step) => (
          <div
            key={step}
            className={`${styles.step} ${
              status === step ? styles.active : ""
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* INFORMAÇÕES DO PEDIDO */}
      <div className={styles.card}>
        <p><strong>Endereço:</strong> {order.delivery_address}</p>
        <p><strong>Total:</strong> R$ {order.total_amount}</p>
        <p><strong>Pagamento:</strong> {order.payment_method}</p>
      </div>

      {/* ITENS */}
      {order.items?.length > 0 && (
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Itens do Pedido</h3>

          {order.items.map((item) => {
            return (
              <div key={item.id} className={styles.itemRow}>
                <div>
                  <strong>{item.product?.name}</strong>
                  <div className={styles.itemInfo}>
                    Quantidade: {item.quantity} <br />
                    Preço: R$ {item.price}
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <button
                    onClick={() =>
                      handleItemStatusChange(item.id, "preparing")
                    }
                    disabled={loading || item.status !== "pending"}
                  >
                    Preparar
                  </button>

                  <button
                    onClick={() =>
                      handleItemStatusChange(item.id, "delivered")
                    }
                    disabled={loading || item.status !== "preparing"}
                  >
                    Entregar
                  </button>

                  <button
                    onClick={() =>
                      handleItemStatusChange(item.id, "canceled")
                    }
                    disabled={loading}
                    className={styles.cancelBtn}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONFIRMAR */}
      {status === "pending" && (
        <div className={styles.actions}>
          <button onClick={handleConfirm} disabled={loading}>
            Confirmar Pedido
          </button>
        </div>
      )}
    </div>
  );
}
