import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, role }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "40vh",
          display: "grid",
          placeItems: "center",
          fontSize: "16px",
          color: "#6b7280",
        }}
      >
        Carregando...
      </div>
    );
  }

  // 🔒 Não autenticado
  if (!isAuthenticated) {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;

    if (role === "admin") {
      return (
        <Navigate
          to="/admin/login"
          state={{ from: redirectPath }}
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        state={{ from: redirectPath }}
        replace
      />
    );
  }

  // 🔒 Autenticado mas role errada
  if (role && user?.role?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/products" replace />;
  }

  return children;
}