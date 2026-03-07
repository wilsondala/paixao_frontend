import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatMedia } from "../utils/media";
import styles from "./Cart.module.css";

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Carrinho vazio");
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: "/checkout" },
      });
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div>
            <span className={styles.badge}>Seu pedido</span>
            <h1 className={styles.title}>Meu Carrinho</h1>
            <p className={styles.subtitle}>
              Revise os itens selecionados antes de finalizar sua compra.
            </p>
          </div>

          {cart.length > 0 && (
            <Link to="/products" className={styles.continueShopping}>
              Continuar comprando
            </Link>
          )}
        </div>

        <div className={styles.card}>
          {cart.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🛍️</div>
              <h2>Seu carrinho está vazio</h2>
              <p>
                Explore os produtos da Paixão Angola e adicione seus favoritos.
              </p>
              <Link to="/products" className={styles.shopButton}>
                Ver Produtos
              </Link>
            </div>
          ) : (
            <div className={styles.content}>
              {/* LISTA */}
              <div className={styles.items}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.imageBox}>
                      <img
                        src={formatMedia(item.images?.[0])}
                        alt={item.name}
                        className={styles.image}
                      />
                    </div>

                    <div className={styles.info}>
                      <h3 className={styles.name}>{item.name}</h3>

                      <p className={styles.price}>
                        R$ {Number(item.price).toFixed(2)}
                      </p>

                      <div className={styles.quantity}>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          −
                        </button>

                        <span className={styles.qtyValue}>{item.quantity}</span>

                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className={styles.subtotal}>
                      <p className={styles.subtotalValue}>
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* RESUMO */}
              <aside className={styles.summary}>
                <div className={styles.summaryCard}>
                  <h2>Resumo do Pedido</h2>

                  <div className={styles.summaryRow}>
                    <span>Itens</span>
                    <strong>{cart.reduce((acc, item) => acc + item.quantity, 0)}</strong>
                  </div>

                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <strong>R$ {Number(total).toFixed(2)}</strong>
                  </div>

                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>Total</span>
                    <strong>R$ {Number(total).toFixed(2)}</strong>
                  </div>

                  {!isAuthenticated && (
                    <div className={styles.notice}>
                      Para concluir a compra, faça login ou crie sua conta.
                    </div>
                  )}

                  <button
                    type="button"
                    className={styles.checkout}
                    onClick={handleCheckout}
                  >
                    Finalizar Compra
                  </button>

                  <button
                    type="button"
                    className={styles.clear}
                    onClick={clearCart}
                  >
                    Limpar Carrinho
                  </button>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}