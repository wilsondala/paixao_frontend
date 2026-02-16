import { Link, Outlet } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      
      <aside className="admin-sidebar">
        <h2>Painel Admin</h2>

        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/create-product">Criar Produto</Link>
          <Link to="/admin/products">Produtos</Link>
        </nav>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>

    </div>
  );
}
