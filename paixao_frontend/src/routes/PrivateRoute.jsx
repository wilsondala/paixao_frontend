import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, role }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <p>Carregando...</p>;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Apenas verifica a role se ela foi passada
  if (role && (!user || user.role?.toUpperCase() !== role.toUpperCase())) {
    return <Navigate to="/products" replace />;
  }

  return children;
}