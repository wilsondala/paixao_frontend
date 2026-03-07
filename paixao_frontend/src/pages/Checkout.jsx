import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders";
import AddressMap from "../components/AddressMap";
import styles from "./Checkout.module.css";
import { formatMedia } from "../utils/media";

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

      alert(
        `✅ Pedido criado com sucesso!\n\nNº do pedido: ${orderId}\n\nAbrindo WhatsApp...`
      );

      const itemsText = cart
        .map(
          (item) =>
            `• ${item.name} x${item.quantity} - ${(
              item.price * item.quantity
            ).toLocaleString("pt-AO")} Kz`
        )
        .join("\n");

      const paymentLabel =
        paymentMethod === "entrega"
          ? "Pagamento na Entrega"
          : "Transferência via Express";

      const message = `
🛍️ *Novo Pedido - Paixão Angola*

📦 Pedido Nº: ${orderId}

🧾 Itens:
${itemsText}

💰 Total: ${total.toLocaleString("pt-AO")} Kz

📍 Endereço: ${address}

💳 Pagamento: ${paymentLabel}
`;

      const phone = "5511967864913";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      clearCart();
      window.open(url, "_blank");
      navigate("/products");
    } catch (error) {
      console.error("Erro completo:", error);
      const msg =
        error.response?.data?.message ||
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
    return <div className={styles.empty}>Seu carrinho está vazio</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            ← Voltar
          </button>

          <div className={styles.header}>
            <div>
              <span className={styles.badge}>Checkout seguro</span>
              <h1 className={styles.title}>Finalizar Pedido</h1>
              <p className={styles.subtitle}>
                Revise seus produtos, confirme o endereço e escolha a forma de
                pagamento.
              </p>
            </div>
          </div>

          {/* ================= RESUMO ================= */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Resumo do Pedido</h3>

            <div className={styles.summaryBox}>
              {cart.map((item) => {
                const cover =
                  formatMedia(
                    item.image_url ||
                      item.images?.[0] ||
                      item.image ||
                      item.photo ||
                      item.thumbnail
                  ) || "/placeholder.png";

                return (
                  <div key={item.id} className={styles.item}>
                    <img
                      src={cover}
                      alt={item.name}
                      className={styles.itemImage}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />

                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemMeta}>
                        Quantidade: {item.quantity}
                      </div>
                    </div>

                    <div className={styles.itemPrice}>
                      {(item.price * item.quantity).toLocaleString("pt-AO")} Kz
                    </div>
                  </div>
                );
              })}

              <div className={styles.total}>
                <span>Total</span>
                <strong>{total.toLocaleString("pt-AO")} Kz</strong>
              </div>
            </div>
          </div>

          {/* ================= ENDEREÇO ================= */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Endereço de Entrega</h3>

            <div className={styles.addressWrapper}>
              <AddressMap
                onSelect={(data) => {
                  setAddress(data.address);
                  setLat(data.lat);
                  setLon(data.lon);
                }}
              />
            </div>

            <p className={styles.selectedText}>
              <strong>Selecionado:</strong>{" "}
              {address || "Nenhum endereço selecionado"}
            </p>
          </div>

          {/* ================= PAGAMENTO ================= */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Forma de Pagamento</h3>

            <div className={styles.paymentGrid}>
              <label
                className={`${styles.paymentCard} ${
                  paymentMethod === "entrega" ? styles.paymentCardActive : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="entrega"
                  checked={paymentMethod === "entrega"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className={styles.paymentIcon}>💵</div>
                <div className={styles.paymentContent}>
                  <h4>Pagamento na Entrega</h4>
                  <p>
                    O cliente paga no momento em que receber a encomenda.
                  </p>
                  <span className={styles.paymentTag}>Disponível agora</span>
                </div>
              </label>

              <label
                className={`${styles.paymentCard} ${
                  paymentMethod === "transferencia"
                    ? styles.paymentCardActive
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="transferencia"
                  checked={paymentMethod === "transferencia"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className={styles.paymentIcon}>📲</div>
                <div className={styles.paymentContent}>
                  <h4>Transferência via Express</h4>
                  <p>
                    Após o pedido, o pagamento pode ser confirmado por
                    transferência.
                  </p>
                  <span className={styles.paymentTag}>Disponível agora</span>
                </div>
              </label>
            </div>

            <div className={styles.paymentFooter}>
              <h4>Em breve</h4>
              <div className={styles.comingSoonList}>
                <span className={styles.comingSoonItem}>Multicaixa</span>
                <span className={styles.comingSoonItem}>Cartão</span>
                <span className={styles.comingSoonItem}>Unitel Money</span>
                <span className={styles.comingSoonItem}>Afrimoney</span>
              </div>
            </div>
          </div>

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}

          <button
            onClick={handleConfirmOrder}
            disabled={loading}
            className={styles.confirmButton}
          >
            {loading ? "Processando..." : "Confirmar Pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}