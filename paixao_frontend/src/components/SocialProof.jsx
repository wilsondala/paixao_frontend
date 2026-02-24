import { useEffect, useState } from "react";
import { getLatestOrders } from "../services/orderService";

export default function SocialProof() {
  const [orders, setOrders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  // 🔹 Buscar pedidos
  const loadOrders = async () => {
    try {
      const data = await getLatestOrders();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Erro ao buscar últimas compras", error);
    }
  };

  // 🔹 Carregar ao iniciar
  useEffect(() => {
    loadOrders();

    // Atualiza lista a cada 30s
    const refreshInterval = setInterval(loadOrders, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  // 🔹 Controlar exibição animada
  useEffect(() => {
    if (!orders.length) return;

    setVisible(true);

    const showDuration = 4000;
    const intervalDuration = 7000;

    const hideTimeout = setTimeout(() => {
      setVisible(false);
    }, showDuration);

    const switchInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % orders.length);
      setVisible(true);
    }, intervalDuration);

    return () => {
      clearTimeout(hideTimeout);
      clearInterval(switchInterval);
    };
  }, [orders]);

  if (!orders.length) return null;

  const order = orders[currentIndex];

  return (
    <div
      style={{
        ...styles.container,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        opacity: visible ? 1 : 0,
      }}
    >
      <div style={styles.icon}>🔥</div>
      <div>
        <div style={styles.text}>
          <strong>{order.first_name}</strong> acabou de comprar
        </div>
        <div style={styles.product}>
          {order.product_name}
        </div>
        <div style={styles.city}>
          📍 {order.city}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
    background: "#111",
    color: "#fff",
    padding: "14px 18px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
    zIndex: 9999,
    transition: "all 0.4s ease",
    maxWidth: "300px",
  },
  icon: {
    fontSize: "22px",
  },
  text: {
    fontSize: "13px",
    opacity: 0.9,
  },
  product: {
    fontSize: "15px",
    fontWeight: "bold",
    marginTop: "2px",
  },
  city: {
    fontSize: "12px",
    opacity: 0.7,
    marginTop: "2px",
  },
};