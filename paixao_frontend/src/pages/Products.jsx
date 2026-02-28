import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import styles from "./Products.module.css";
import { formatMedia } from "../utils/media";
import MainLayout from "../layouts/MainLayout";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [products]);

  return (
    <MainLayout>
      <div className={styles.page}>
        {/* ================= HERO / CARROSSEL ================= */}
        <section className={styles.hero}>
          <div
            className={styles.heroSlide}
            style={{
              backgroundImage: `url('/imagem/produtos/kitavelã.JPG')`,
            }}
          >
            <div className={styles.overlay}></div>

            <div className={styles.heroContent}>
              <h1>Descubra a Paixão</h1>
              <p>Óleos e loções corporais com fragrâncias irresistíveis</p>
              <Link to="/products" className={styles.heroButton}>
                Ver Todos os Produtos
              </Link>
            </div>
          </div>
        </section>

        {/* ================= PRODUTOS ================= */}
        <section className={styles.main}>
          <h2 className={styles.title}>Nossos Produtos</h2>

          {loading && (
            <p className={styles.center}>Carregando produtos...</p>
          )}

          {error && <p className={styles.error}>{error}</p>}

          {!loading && !error && (
            <div className={styles.grid}>
              {products.length === 0 ? (
                <p className={styles.center}>
                  Nenhum produto disponível no momento.
                </p>
              ) : (
                products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className={styles.card}
                  >
                    <div className={styles.imageContainer}>
                      <img
                        src={
                          formatMedia(product.images?.[0]) ||
                          "/placeholder.png"
                        }
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
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}