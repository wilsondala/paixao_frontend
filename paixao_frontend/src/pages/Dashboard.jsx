import { useAuth } from "../context/AuthContext";
import OrderList from "../components/OrderList";

export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <button onClick={logout}>Sair</button>

      <hr />

      <h2>Pedidos</h2>
      <OrderList />
    </div>
  );
}
