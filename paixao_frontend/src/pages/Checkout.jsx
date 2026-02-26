import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders";
import AddressMap from "../components/AddressMap";
import MainLayout from "../layouts/MainLayout";
import styles from "./Checkout.module.css";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("entrega");
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio");
      return;
    }

    if (!address || !lat || !lon) {
      alert("Selecione um endereço válido no mapa");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const orderData = {
        delivery_address: address,
        payment_method: paymentMethod,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        latitude: lat,
        longitude: lon,
      };

      const response = await createOrder(orderData);

      const orderId = response?.id || response?.data?.id || "N/A";

      alert(`✅ Pedido criado com sucesso!\n\nNº do pedido: ${orderId}\n\nAbrindo WhatsApp...`);

      const itemsText = cart
        .map(
          (item) =>
            `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString(
              "pt-AO"
            )} Kz`
        )
        .join("\n");

      const message = `
🛍️ *Novo Pedido - Paixão Angola*

📦 Pedido Nº: ${orderId}

🧾 Itens:
${itemsText}

💰 Total: ${total.toLocaleString("pt-AO")} Kz

📍 Endereço: ${address}

💳 Pagamento: ${
        paymentMethod === "entrega" ? "Pagamento na Entrega" : "Transferência"
      }
`;

      const phone = "5511967864913";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      clearCart();
      window.open(url, "_blank");
      navigate("/products");
    } catch (error) {
      console.error("Erro completo:", error);
      const msg = error.response?.data?.message || 
                  error.response?.data?.error || 
                  error.message || 
                  "Erro desconhecido no servidor";
      setErrorMsg(msg);
      alert(`❌ Erro ao criar pedido:\n\n${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <MainLayout>
        <div className={styles.empty}>Seu carrinho está vazio</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Voltar
        </button>

        <h1 className={styles.title}>Finalizar Pedido</h1>

        {/* Resumo */}
        <div className={styles.section}>
          <h3>Resumo do Pedido</h3>
          {cart.map((item) => (
            <div key={item.id} className={styles.item}>
              <img
                src={item.image_url || "/placeholder.png"}
                alt={item.name}
                className={styles.itemImage}
              />
              <div className={styles.itemInfo}>
                {item.name} ×{item.quantity}
              </div>
              <div className={styles.itemPrice}>
                {(item.price * item.quantity).toLocaleString("pt-AO")} Kz
              </div>
            </div>
          ))}
          <div className={styles.total}>
            Total: {total.toLocaleString("pt-AO")} Kz
          </div>
        </div>

        {/* ================= ENDEREÇO - CAMPO DE BUSCA CENTRALIZADO E MAIOR ================= */}
        <div className={styles.section}>
          <h3>Endereço de Entrega</h3>
          
          {/* Container centralizado e maior (exatamente onde você marcou) */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "25px 0 15px",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "680px",        // ← maior que os botões BUSCAR/LIMPAR
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)",
              }}
            >
              <AddressMap
                onSelect={(data) => {
                  setAddress(data.address);
                  setLat(data.lat);
                  setLon(data.lon);
                }}
              />
            </div>
          </div>

          <p>
            <strong>Selecionado:</strong> {address || "Nenhum endereço selecionado"}
          </p>
        </div>

        {/* Pagamento */}
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

        {errorMsg && <p style={{ color: "red", textAlign: "center", margin: "10px 0" }}>{errorMsg}</p>}

        <button
          onClick={handleConfirmOrder}
          disabled={loading}
          className={styles.button}
        >
          {loading ? "Processando..." : "Confirmar Pedido"}
        </button>
      </div>
    </MainLayout>
  );
}