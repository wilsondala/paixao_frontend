import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import styles from "./Cart.module.css";
import MainLayout from "../layouts/MainLayout";

export default function Cart() {
  const { cart, removeFromCart, clearCart, total, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [orderSent, setOrderSent] = useState(false);

  if (cart.length === 0) {
    return (
      <MainLayout>
        <div className={styles.empty}>
          {orderSent ? (
            <>
              <h2>✅ Pedido enviado com sucesso!</h2>
              <button onClick={() => navigate("/products")}>Voltar para Loja</button>
            </>
          ) : (
            <>
              <h2>Seu carrinho está vazio 🛒</h2>
              <button onClick={() => navigate("/products")}>Voltar para Loja</button>
            </>
          )}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <button 
            className={styles.backButton} 
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>
          <h1>Seu Carrinho</h1>
        </div>

        <div className={styles.list}>
          {cart.map((item) => (
            <div key={item.id} className={styles.item}>
              <img 
                src={item.image_url || "/placeholder.png"} 
                alt={item.name} 
              />

              <div className={styles.info}>
                <h3>{item.name}</h3>
                <p>{Number(item.price).toLocaleString("pt-AO")} Kz</p>

                <div className={styles.quantityControls}>
                  <button
                    onClick={() => {
                      const newQty = item.quantity - 1;
                      if (newQty <= 0) removeFromCart(item.id);
                      else updateQuantity(item.id, newQty);
                    }}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className={styles.removeButton}
                onClick={() => removeFromCart(item.id)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2>Total: {Number(total).toLocaleString("pt-AO")} Kz</h2>

          <button
            className={styles.checkoutButton}
            onClick={() => navigate("/checkout")}
          >
            Finalizar Pedido
          </button>

          <button
            className={styles.clearButton}
            onClick={clearCart}
          >
            Limpar Carrinho
          </button>
        </div>
      </div>
    </MainLayout>
  );
}