import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import styles from "./Products.module.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState({});
  const [modalImage, setModalImage] = useState(null);

  const { addToCart } = useCart();
  const navigate = useNavigate(); // 🔥 NOVO

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const getFileUrl = (file) => {
    if (!file) return "/placeholder.png";
    if (file.startsWith("http")) return file;
    return `/imagem/produtos/${file}`;
  };

  const handleNextImage = (productId, length) => {
    setSelectedImageIndex((prev) => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: (current + 1) % length };
    });
  };

  const handlePrevImage = (productId, length) => {
    setSelectedImageIndex((prev) => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: (current - 1 + length) % length };
    });
  };

  if (loading) {
    return <div className={styles.loading}>Carregando produtos...</div>;
  }

  if (!products.length) {
    return (
      <div className={styles.loading}>
        Nenhum produto disponível no momento.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {products.map((product) => {
          const images = Array.isArray(product.images)
            ? product.images
            : product.image
            ? [product.image]
            : [];

          const currentIndex = selectedImageIndex[product.id] || 0;

          return (
            <div
              key={product.id}
              className={styles.card}
              onClick={() => navigate(`/produto/${product.id}`)} // 🔥 AGORA NAVEGA
            >
              <div className={styles.imageWrapper}>
                {images.length > 0 ? (
                  <>
                    <img
                      src={getFileUrl(images[currentIndex])}
                      alt={product.name}
                      className={styles.image}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalImage(getFileUrl(images[currentIndex]));
                      }}
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />

                    {images.length > 1 && (
                      <div className={styles.imageControls}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrevImage(product.id, images.length);
                          }}
                        >
                          ◀
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNextImage(product.id, images.length);
                          }}
                        >
                          ▶
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src="/placeholder.png"
                    alt="Sem imagem"
                    className={styles.image}
                  />
                )}

                {product.video_url && (
                  <div className={styles.videoWrapper}>
                    <iframe
                      src={
                        product.video_url.includes("streamable.com")
                          ? product.video_url.replace(
                              "streamable.com/",
                              "streamable.com/e/"
                            )
                          : product.video_url
                      }
                      title={`Vídeo do produto ${product.name}`}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>

              <div className={styles.info}>
                <h3 className={styles.name}>{product.name}</h3>

                <p className={styles.price}>
                  {Number(product.price).toLocaleString("pt-AO")} Kz
                </p>

                <button
                  className={styles.addButton}
                  onClick={(e) => {
                    e.stopPropagation(); // 🔥 IMPede navegação
                    addToCart(product);
                  }}
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalImage && (
        <div
          className={styles.modal}
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Imagem ampliada"
            className={styles.modalImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}