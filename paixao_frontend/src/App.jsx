import { Routes, Route, Navigate } from "react-router-dom";

import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import PrivateRoute from "./routes/PrivateRoute";

import SocialProof from "./components/SocialProof"; // 🔥 PROVA SOCIAL

// ================= PÁGINAS PÚBLICAS =================
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import SobreNos from "./pages/SobreNos";

// ================= PÁGINAS PRIVADAS =================
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";

// ================= ADMIN =================
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import CreateProduct from "./components/CreateProduct";
import EditProduct from "./components/EditProduct";
import ProductsAdmin from "./components/ProductsAdmin";

export default function App() {
  return (
    <UserProvider>
      <CartProvider>
        <AuthProvider>

          {/* 🔥 PROVA SOCIAL GLOBAL */}
          <SocialProof />

          <Routes>

            {/* ================= ROTAS PÚBLICAS ================= */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ================= ROTAS PRIVADAS USUÁRIO ================= */}
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
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

            <Route
              path="/orders/:id"
              element={
                <PrivateRoute>
                  <OrderDetails />
                </PrivateRoute>
              }
            />

            {/* ================= ROTAS ADMIN ================= */}
            <Route
              path="/admin"
              element={
                <PrivateRoute role="admin">
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="create-product" element={<CreateProduct />} />
              <Route path="products" element={<ProductsAdmin />} />
              <Route path="edit-product/:id" element={<EditProduct />} />
            </Route>

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </AuthProvider>
      </CartProvider>
    </UserProvider>
  );
}