import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getOrderById, 
  confirmOrder, 
  updateItemStatus 
} from "../api/orders";

import styles from "./OrderDetails.module.css";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadOrder() {
    const data = await getOrderById(id);
    setOrder(data);
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (!order) return <p className={styles.loading}>Carregando...</p>;

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

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Voltar
      </button>

      <h2 className={styles.title}>Pedido #{order.id}</h2>

      {/* STATUS BADGE */}
      <div className={`${styles.status} ${styles[status]}`}>
        {order.status}
      </div>

      {/* TIMELINE AJUSTADA */}
      <div className={styles.timeline}>
        <div className={`${styles.step} ${status === "pending" ? styles.active : ""}`}>
          Pendente
        </div>

        <div className={`${styles.step} ${status === "confirmed" ? styles.active : ""}`}>
          Confirmado
        </div>

        <div className={`${styles.step} ${status === "sent" ? styles.active : ""}`}>
          Enviado
        </div>

        <div className={`${styles.step} ${status === "canceled" ? styles.active : ""}`}>
          Cancelado
        </div>
      </div>

      {/* DETALHES */}
      <div className={styles.card}>
        <p><strong>Endereço:</strong> {order.delivery_address}</p>
        <p><strong>Total:</strong> R$ {order.total_amount}</p>
        <p><strong>Pagamento:</strong> {order.payment_method}</p>
      </div>

      {/* ITENS */}
      {order.items && order.items.length > 0 && (
        <div className={styles.card}>
          <h3 style={{ marginBottom: "20px" }}>Itens do Pedido</h3>

          {order.items.map((item) => {

            const statusClass =
              item.status === "pending"
                ? styles.pending
                : item.status === "preparing"
                ? styles.preparing
                : item.status === "delivered"
                ? styles.delivered
                : item.status === "canceled"
                ? styles.canceled
                : "";

            return (
              <div key={item.id} className={styles.itemRow}>
                <div className={styles.itemLeft}>
                  <strong>{item.product?.name}</strong>
                  <div className={styles.itemInfo}>
                    Quantidade: {item.quantity} <br />
                    Preço: R$ {item.price}
                  </div>
                </div>

                <div className={styles.itemRight}>
                  <span className={`${styles.itemStatus} ${statusClass}`}>
                    {item.status}
                  </span>

                  <div className={styles.itemActions}>
                    <button
                      className={styles.btnPrepare}
                      onClick={() =>
                        handleItemStatusChange(item.id, "preparing")
                      }
                      disabled={loading}
                    >
                      Preparar
                    </button>

                    <button
                      className={styles.btnDeliver}
                      onClick={() =>
                        handleItemStatusChange(item.id, "delivered")
                      }
                      disabled={loading}
                    >
                      Entregar
                    </button>

                    <button
                      className={styles.btnCancel}
                      onClick={() =>
                        handleItemStatusChange(item.id, "canceled")
                      }
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BOTÕES */}
      <div className={styles.actions}>
        {status === "pending" && (
          <button onClick={handleConfirm} disabled={loading}>
            Confirmar Pedido
          </button>
        )}
      </div>
    </div>
  );
}
