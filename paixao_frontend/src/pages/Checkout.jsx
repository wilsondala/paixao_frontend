import AddressMap from "../components/AddressMap";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders";
import styles from "./Checkout.module.css";
import MainLayout from "../layouts/MainLayout";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("entrega");
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  const handleConfirmOrder = async () => {
    if (!address || cart.length === 0) {
      alert("Preencha o endereço e adicione produtos ao carrinho");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        delivery_address: address,
        payment_method: paymentMethod,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        latitude: lat,
        longitude: lon,
      };

      const order = await createOrder(orderData);

      const itemsText = cart.map(item =>
        `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString("pt-AO")} Kz`
      ).join("\n");

      const message = `
🛍️ *Novo Pedido - Paixão Angola*

📦 Pedido Nº: ${order.id}

🧾 Itens:
${itemsText}

💰 Total: ${total.toLocaleString("pt-AO")} Kz

📍 Endereço: ${address}

💳 Pagamento: ${paymentMethod === "entrega" ? "Pagamento na Entrega" : "Transferência"}
`;

      const phone = "5511967864913";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      clearCart();
      window.open(url, "_blank");
      navigate("/products");

    } catch (error) {
      alert("Erro ao criar pedido");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <MainLayout><div className={styles.empty}>Seu carrinho está vazio</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Voltar
        </button>

        <h1 className={styles.title}>Finalizar Pedido</h1>

        {/* ================= RESUMO DO PEDIDO COM IMAGENS ================= */}
        <div className={styles.section}>
          <h3>Resumo do Pedido</h3>
          
          {cart.map((item) => (
            <div key={item.id} className={styles.item}>
              <img 
                src={item.image_url} 
                alt={item.name} 
                className={styles.itemImage}
              />
              <div className={styles.itemInfo}>
                <span>{item.name} ×{item.quantity}</span>
              </div>
              <span className={styles.itemPrice}>
                {(item.price * item.quantity).toLocaleString("pt-AO")} Kz
              </span>
            </div>
          ))}

          <div className={styles.total}>
            Total: {total.toLocaleString("pt-AO")} Kz
          </div>
        </div>

        {/* Endereço */}
        <div className={styles.section}>
          <h3>Endereço de Entrega</h3>
          <AddressMap onSelect={(data) => {
            setAddress(data.address);
            setLat(data.lat);
            setLon(data.lon);
          }} />
          <p><strong>Selecionado:</strong> {address}</p>
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