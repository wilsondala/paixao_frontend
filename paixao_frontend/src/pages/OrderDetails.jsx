import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, confirmOrder, deliverOrder } from "../api/orders";
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

  async function handleDeliver() {
    setLoading(true);
    await deliverOrder(order.id);
    await loadOrder();
    setLoading(false);
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

      {/* TIMELINE */}
      <div className={styles.timeline}>
        <div className={`${styles.step} ${status === "paid" ? styles.active : ""}`}>
          Pago
        </div>

        <div className={`${styles.step} ${status === "confirmed" ? styles.active : ""}`}>
          Confirmado
        </div>

        <div className={`${styles.step} ${status === "ready_for_delivery" ? styles.active : ""}`}>
          Pronto
        </div>

        <div className={`${styles.step} ${status === "sent" ? styles.active : ""}`}>
          Enviado
        </div>
      </div>

      {/* DETALHES */}
      <div className={styles.card}>
        <p><strong>Cliente:</strong> {order.customer_name}</p>
        <p><strong>Telefone:</strong> {order.phone}</p>
        <p><strong>Endereço:</strong> {order.address}</p>
        <p><strong>Total:</strong> R$ {order.total}</p>
        <p><strong>Pagamento:</strong> {order.payment_method}</p>
      </div>
            {/* ITENS DO PEDIDO */}
      {order.items && order.items.length > 0 && (
        <div className={styles.card}>
          <h3>Itens do Pedido</h3>

          {order.items.map((item) => (
            <div key={item.id} style={{ marginBottom: "10px" }}>
              <p>
                <strong>Produto:</strong> {item.product?.name}
              </p>
              <p>Quantidade: {item.quantity}</p>
              <p>Preço: R$ {item.price}</p>
              <p>
                <strong>Status:</strong> {item.status}
              </p>
              <hr />
            </div>
          ))}
        </div>
      )}

      {/* BOTÕES */}
      <div className={styles.actions}>
        {status === "paid" && (
          <button onClick={handleConfirm} disabled={loading}>
            Confirmar Pedido
          </button>
        )}

        {status === "confirmed" && (
          <button onClick={handleDeliver} disabled={loading}>
            Enviar Pedido
          </button>
        )}
      </div>
    </div>
  );
}
