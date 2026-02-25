import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import styles from "./Cart.module.css";
import { formatMedia } from "../utils/media";
import MainLayout from "../layouts/MainLayout";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
  } = useCart();

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Meu Carrinho</h1>

        {cart.length === 0 ? (
          <div className={styles.empty}>
            <p>Seu carrinho está vazio.</p>
            <Link to="/products" className={styles.shopButton}>
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div className={styles.content}>
            {/* ================= LISTA ================= */}
            <div className={styles.items}>
              {cart.map((item) => (
                <div key={item.id} className={styles.item}>
                  <img
                    src={formatMedia(item.images?.[0])}
                    alt={item.name}
                    className={styles.image}
                  />

                  <div className={styles.info}>
                    <h3>{item.name}</h3>
                    <p>R$ {Number(item.price).toFixed(2)}</p>

                    <div className={styles.quantity}>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className={styles.subtotal}>
                    <p>
                      R${" "}
                      {(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      className={styles.remove}
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= RESUMO ================= */}
            <div className={styles.summary}>
              <h2>Resumo</h2>

              <div className={styles.totalRow}>
                <span>Total:</span>
                <strong>
                  R$ {Number(total).toFixed(2)}
                </strong>
              </div>

              <button className={styles.checkout}>
                Finalizar Compra
              </button>

              <button
                className={styles.clear}
                onClick={clearCart}
              >
                Limpar Carrinho
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}