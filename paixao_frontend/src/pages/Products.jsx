import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import styles from "./Products.module.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Carregando produtos...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        
        {/* 🔙 BOTÃO VOLTAR */}
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ← Voltar
        </button>

        <h1 className={styles.title}>Paixão Angola 💜</h1>

        <button
          className={styles.cartButton}
          onClick={() => navigate("/cart")}
        >
          🛒 Carrinho ({cart.length})
        </button>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={product.image_url || "/placeholder.png"}
                alt={product.name}
                className={styles.image}
              />
            </div>

            <div className={styles.info}>
              <h3 className={styles.name}>{product.name}</h3>
              <p className={styles.price}>
                {Number(product.price).toLocaleString("pt-AO")} Kz
              </p>

              <button
                className={styles.addButton}
                onClick={() => addToCart(product)}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
