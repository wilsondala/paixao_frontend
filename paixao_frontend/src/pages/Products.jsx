import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import styles from "./Products.module.css";
import { formatMedia } from "../utils/media";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Produtos</h1>

      <div className={styles.grid}>
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className={styles.card}
          >
            <div className={styles.imageContainer}>
              <img
                src={formatMedia(product.images?.[0])}
                alt={product.name}
                className={styles.image}
              />
            </div>

            <div className={styles.info}>
              <h3>{product.name}</h3>
              <p className={styles.price}>
                R$ {Number(product.price).toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}