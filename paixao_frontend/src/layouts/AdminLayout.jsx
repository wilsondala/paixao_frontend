import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AdminLayout.css";
import "../admin/AdminTheme.css";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="admin-scope admin-layout">
      <header className="admin-topbar">
        <button
          className="admin-menu-btn"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          ☰
        </button>

        <div className="admin-topbar-title">Painel Admin</div>
      </header>

      <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
        <div className="admin-sidebar-head">
          <h2>Painel Admin</h2>

          <button
            className="admin-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/create-product">Criar Produto</Link>
          <Link to="/admin/products">Produtos</Link>
          <Link to="/admin/newsletter">Newsletter</Link>
        </nav>
      </aside>

      {open && <div className="admin-overlay" onClick={() => setOpen(false)} />}

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}