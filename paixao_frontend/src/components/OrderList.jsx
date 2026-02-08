import { useEffect, useState } from "react";
import { getOrders } from "../api/orders";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError("Erro ao carregar pedidos");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) return <p>Carregando pedidos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <table border="1" cellPadding="8" style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Pagamento</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.status}</td>
            <td>{order.payment_method}</td>
            <td>{order.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
