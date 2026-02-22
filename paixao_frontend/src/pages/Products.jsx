import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import styles from "./Products.module.css";
import { formatMedia } from "../utils/media";
import MainLayout from "../layouts/MainLayout";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Auto slide a cada 5 segundos
  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products]);

  return (
    <MainLayout>
      <div className={styles.container}>
        
        {/* ================= CARROSSEL TOPO ================= */}
        {/* ================= CARROSSEL TOPO (MENOR) ================= */}
        <div className={styles.carousel}>
          <div className={styles.slide} style={{ 
            backgroundImage: `url('/imagem/produtos/kitavelã.JPG')` 
          }}>
            <div className={styles.carouselContent}>
              <h1>Descubra a Paixão</h1>
              <p>Óleos e loções corporais com fragrâncias irresistíveis</p>
              <Link to="/products" className={styles.carouselButton}>
                Ver Todos os Produtos
              </Link>
            </div>
          </div>
        </div>

        {/* ================= TÍTULO PRODUTOS ================= */}
        <main className={styles.main}>
          <h2 className={styles.title}>Nossos Produtos</h2>

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
        </main>
      </div>
    </MainLayout>
  );
}