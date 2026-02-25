import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, role }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <p>Carregando...</p>;

  // 🔒 Não autenticado
  if (!isAuthenticated) {
    if (role === "admin") {
      return (
        <Navigate
          to="/admin/login"
          state={{ from: location.pathname }}
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
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