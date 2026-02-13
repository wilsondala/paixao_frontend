import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import OrderDetails from "./pages/OrderDetails";
import Products from "./pages/Products"; // 👈 ADICIONE ISSO
import Cart from "./pages/Cart";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/orders/:id" element={<OrderDetails />} />

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
            <Cart />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
