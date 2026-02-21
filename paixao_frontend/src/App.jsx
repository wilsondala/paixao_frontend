// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom"; // sem BrowserRouter
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import SobreNos from "./pages/SobreNos";
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
          <Routes>
            {/* Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            {/* Privadas usuário */}
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

            {/* Admin */}
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

            {/* Redirecionamento caso rota não exista */}
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </AuthProvider>
      </CartProvider>
    </UserProvider>
  );
}