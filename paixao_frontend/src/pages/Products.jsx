import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import styles from "./Products.module.css";

const API_URL = "http://localhost:8000";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState({});
  const [modalImage, setModalImage] = useState(null);

  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao carregar produtos", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

const getFileUrl = (file) => {
  if (!file) return "/placeholder.png"; // fallback
  if (file.startsWith("http")) return file; // URL externa
  // arquivo local na pasta public
  return `/images/produtos/${file}`;
};


  const handleNextImage = (productId, imagesLength) => {
    setSelectedImageIndex((prev) => {
      const currentIndex = prev[productId] || 0;
      return {
        ...prev,
        [productId]: (currentIndex + 1) % imagesLength,
      };
    });
  };

  const handlePrevImage = (productId, imagesLength) => {
    setSelectedImageIndex((prev) => {
      const currentIndex = prev[productId] || 0;
      return {
        ...prev,
        [productId]:
          (currentIndex - 1 + imagesLength) % imagesLength,
      };
    });
  };

  if (loading) {
    return <div className={styles.loading}>Carregando produtos...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
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
        {products.map((product) => {
          console.log("Produto completo:", product);

          let images = [];

          if (Array.isArray(product.images)) {
            images = product.images;
          } else if (product.image) {
            images = [product.image];
          }

          const currentIndex = selectedImageIndex[product.id] || 0;
          const videoUrl = product.video_url;

          return (
            <div key={product.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                {images.length > 0 ? (
                  <>
                    <img
                      src={getFileUrl(images[currentIndex])}
                      alt={product.name}
                      className={styles.image}
                      onClick={() =>
                        setModalImage(
                          getFileUrl(images[currentIndex])
                        )
                      }
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />

                    {images.length > 1 && (
                      <div className={styles.imageControls}>
                        <button
                          onClick={() =>
                            handlePrevImage(product.id, images.length)
                          }
                        >
                          ◀
                        </button>
                        <button
                          onClick={() =>
                            handleNextImage(product.id, images.length)
                          }
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

                {/* 🔥 VIDEO EMBED CORRIGIDO */}
                {videoUrl && (
                  <div className={styles.videoWrapper}>
                    <iframe
                      src={
                        videoUrl.includes("streamable.com")
                          ? videoUrl.replace(
                              "streamable.com/",
                              "streamable.com/e/"
                            )
                          : videoUrl
                      }
                      title="Video do produto"
                      frameBorder="0"
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
                  onClick={() => addToCart(product)}
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔥 MODAL DE IMAGEM */}
      {modalImage && (
        <div
          className={styles.modal}
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Imagem ampliada"
            className={styles.modalImage}
          />
        </div>
      )}
    </div>
  );
}