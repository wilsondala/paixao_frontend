import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";

import SocialProof from "./components/SocialProof";
import Layout from "./components/Layout";

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
import Profile from "./pages/Profile";

// ================= ADMIN =================
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import CreateProduct from "./components/CreateProduct";
import EditProduct from "./components/EditProduct";
import ProductsAdmin from "./components/ProductsAdmin";
import AdminNewsletter from "./pages/AdminNewsletter";
export default function App() {
  return (
    <>
      {/* 🔥 PROVA SOCIAL GLOBAL */}
      <SocialProof />

      <Routes>
        {/* ================= ROTAS PÚBLICAS COM LAYOUT ================= */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/products"
          element={
            <Layout>
              <Products />
            </Layout>
          }
        />

        <Route
          path="/products/:id"
          element={
            <Layout>
              <ProductDetails />
            </Layout>
          }
        />

        <Route
          path="/sobre-nos"
          element={
            <Layout>
              <SobreNos />
            </Layout>
          }
        />

        {/* ================= LOGIN / REGISTER ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ================= ROTAS PRIVADAS USUÁRIO ================= */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Layout>
                <Cart />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Layout>
                <Checkout />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <PrivateRoute>
              <Layout>
                <OrderDetails />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
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
          <Route path="newsletter" element={<AdminNewsletter />} /> 
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}