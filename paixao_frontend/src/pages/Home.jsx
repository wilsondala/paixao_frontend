import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";
import styles from "./Home.module.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const data = await getProducts();
    setProducts(data);
  }

  return (
    <div className={styles.container}>
      {/* HERO */}
      <section className={styles.hero}>
        <h1>Bem-vindo à nossa loja</h1>
        <p>Descubra os melhores produtos para você</p>
      </section>

      {/* PRODUTOS */}
      <section className={styles.productsSection}>
        <h2>Nossos Produtos</h2>

        <div className={styles.grid}>
          {products.map((product) => (
            <div
              key={product.id}
              className={styles.card}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <img
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.name}
              />

              <div className={styles.cardContent}>
                <h3>{product.name}</h3>
                <p className={styles.price}>
                  R$ {Number(product.price).toFixed(2)}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/products/${product.id}`);
                  }}
                >
                  Ver Produto
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
