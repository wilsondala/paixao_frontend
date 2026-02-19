import AddressMap from "../components/AddressMap";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders";
import styles from "./Checkout.module.css";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("entrega");
  const [loading, setLoading] = useState(false);

  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  const handleConfirmOrder = async () => {
    // 🔹 Validação básica de campos
    const missingFields = [];
    if (!address) missingFields.push("Endereço");
    if (!cart || cart.length === 0) missingFields.push("Carrinho vazio");

    if (missingFields.length > 0) {
      alert(`⚠️ Campos obrigatórios faltando: ${missingFields.join(", ")}`);
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        delivery_address: address,
        payment_method: paymentMethod,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        // ✅ Latitude e longitude convertidas para número
        latitude: lat !== null ? Number(lat) : undefined,
        longitude: lon !== null ? Number(lon) : undefined,
      };

      // 🔹 Log completo para debug
      //console.log("💡 Dados que serão enviados para criar pedido:", orderData);

      const order = await createOrder(orderData);

      // 🔹 Montar lista de produtos
      const itemsText = cart
        .map(
          (item) =>
            `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString("pt-AO")} Kz`
        )
        .join("\n");

      // 🔹 Montar mensagem completa para WhatsApp
      const message = `
🛍️ *Novo Pedido - Paixão Angola*

📦 Pedido Nº: ${order.id}

🧾 Itens:
${itemsText}

💰 Total: ${total.toLocaleString("pt-AO")} Kz

📍 Endereço:
${address}

💳 Pagamento:
${paymentMethod === "entrega" ? "Pagamento na Entrega" : "Transferência"}
`;

      // ⚠️ Número no formato internacional sem "+"
      const phone = "5511967864913"; // <-- coloque seu número correto aqui
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      clearCart();
      window.open(url, "_blank");
      navigate("/products");

    } catch (error) {
      if (error.response) {
        console.error("⚠️ Backend respondeu com erro:", error.response.data);
      } else {
        console.error("❌ Erro inesperado:", error);
      }
      alert("Erro ao criar pedido");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <div className={styles.empty}>Seu carrinho está vazio</div>;
  }

  return (
    <div className={styles.container}>
      <button
        onClick={() => navigate(-1)}
        className={styles.backButton}
      >
        ← Voltar
      </button>

      <h1 className={styles.title}>Finalizar Pedido</h1>

      <div className={styles.section}>
        <h3>Resumo do Pedido</h3>
        {cart.map((item) => (
          <div key={item.id} className={styles.item}>
            <span>{item.name} x{item.quantity}</span>
            <span>{(item.price * item.quantity).toLocaleString("pt-AO")} Kz</span>
          </div>
        ))}
        <div className={styles.total}>Total: {total.toLocaleString("pt-AO")} Kz</div>
      </div>

      <div className={styles.section}>
        <h3>Endereço de Entrega</h3>
        <AddressMap
          onSelect={(data) => {
            setAddress(data.address);
            setLat(Number(data.lat)); // ✅ Convertendo para número
            setLon(Number(data.lon)); // ✅ Convertendo para número
            console.log("Latitude:", data.lat);
            console.log("Longitude:", data.lon);
          }}
        />
        <p><strong>Selecionado:</strong> {address}</p>
      </div>

      <div className={styles.section}>
        <h3>Método de Pagamento</h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className={styles.select}
        >
          <option value="entrega">Pagamento na Entrega</option>
          <option value="transferencia">Transferência</option>
        </select>
      </div>

      <button
        onClick={handleConfirmOrder}
        disabled={loading}
        className={styles.button}
      >
        {loading ? "Processando..." : "Confirmar Pedido"}
      </button>
    </div>
  );
}
