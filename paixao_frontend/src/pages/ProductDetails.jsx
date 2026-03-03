import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import styles from "./ProductDetails.module.css";
import { formatMedia } from "../utils/media";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(id);
      setProduct(response.data);
      setSelectedImage(response.data.images?.[0]);
      setError(null);
    } catch (err) {
      setError("Produto não encontrado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* ================= HERO ================= */}
      {product && (
        <div
          className={styles.hero}
          style={{
            backgroundImage: `url(${formatMedia(product.images?.[0])})`,
          }}
        >
          <div className={styles.heroContent}>
            <h1>{product.name}</h1>
            <p>Descubra todos os detalhes do produto</p>
          </div>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className={styles.container}>
        {loading && <p className={styles.center}>Carregando...</p>}
        {error && <p className={styles.center}>{error}</p>}

        {!loading && product && (
          <>
            <div className={styles.gallery}>
              <div className={styles.mainImage}>
                <img src={formatMedia(selectedImage)} alt={product.name} />
              </div>

              <div className={styles.thumbnailContainer}>
                {product.images?.map((img, index) => (
                  <img
                    key={index}
                    src={formatMedia(img)}
                    alt="thumb"
                    onClick={() => setSelectedImage(img)}
                    className={`${styles.thumbnail} ${
                      selectedImage === img ? styles.active : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className={styles.info}>
              <h2>{product.name}</h2>

              <p className={styles.price}>
                R$ {Number(product.price).toFixed(2)}
              </p>

              <p className={styles.description}>{product.description}</p>

              <button
                className={styles.buyButton}
                onClick={() => addToCart(product)}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}