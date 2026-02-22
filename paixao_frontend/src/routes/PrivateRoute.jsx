// src/routes/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, role }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <p>Carregando...</p>;

  if (!isAuthenticated) {
    // Se rota admin, vai para login admin
    if (role?.toLowerCase() === "admin") {
      return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
    }
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!user || (role && user.role?.toLowerCase() !== role.toLowerCase())) {
    return <Navigate to="/products" replace />;
  }

  return children;
}