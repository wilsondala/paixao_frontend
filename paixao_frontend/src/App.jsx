import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import OrderDetails from "./pages/OrderDetails";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { UserProvider } from "./context/UserContext";
import jwt_decode from "jwt-decode";
import EditProduct from "./components/EditProduct";

import CreateProduct from "./components/CreateProduct";
import AdminLayout from "./layouts/AdminLayout";
import ProductsAdmin from "./components/ProductsAdmin";



// ===============================
// 🔐 ROTA PROTEGIDA ADMIN
// ===============================
function PrivateAdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const decoded = jwt_decode(token);

    if (decoded.role !== "ADMIN") {
      return <Navigate to="/admin/login" replace />;
    }

    return children;
  } catch (err) {
    console.error("Erro ao decodificar JWT:", err);
    return <Navigate to="/admin/login" replace />;
  }
}


// ===============================
// 🚀 ROTAS
// ===============================
function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLICAS ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />


      {/* ================= SITE PRIVADO ================= */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/products"
        element={
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        }
      />

      <Route
        path="/orders/:id"
        element={
          <PrivateRoute>
            <OrderDetails />
          </PrivateRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        }
      />


      {/* ================= ADMIN PROFISSIONAL ================= */}

      <Route
        path="/admin"
        element={
          <PrivateAdminRoute>
            <AdminLayout />
          </PrivateAdminRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="create-product" element={<CreateProduct />} />
        <Route path="products" element={<ProductsAdmin />} />
        <Route path="edit-product/:id" element={<EditProduct />} />
      </Route>


      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}


// ===============================
// ROOT APP
// ===============================
export default function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}
