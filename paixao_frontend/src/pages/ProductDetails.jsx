import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import styles from "./ProductDetails.module.css";
import { formatMedia } from "../utils/media";
import { useCart } from "../context/CartContext";
import MainLayout from "../layouts/MainLayout";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [latestOrders, setLatestOrders] = useState([]);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [usedOrders, setUsedOrders] = useState(new Set());

  const [timeLeft, setTimeLeft] = useState(900);
  const [selectedImage, setSelectedImage] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 Buscar produto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);

        if (response.data.images?.length > 0) {
          setSelectedImage(formatMedia(response.data.images[0]));
          setShowVideo(false);
        }
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔥 Buscar últimas compras reais (apenas completadas)
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await api.get("/orders/latest");
        // Filtra apenas status = completed (ou pago)
        const filtered = response.data.filter(
          (o) => o.status === "completed" || o.payment_status === "completed"
        );
        setLatestOrders(filtered);
      } catch (err) {
        console.error("Erro ao buscar últimas compras:", err);
      }
    };

    fetchLatest();
  }, []);

  // 🔥 Rotacionar popup real
  useEffect(() => {
    if (latestOrders.length === 0) return;

    const interval = setInterval(() => {
      // Escolhe aleatório sem repetir recentemente
      const available = latestOrders.filter(
        (o) => !usedOrders.has(o.id)
      );

      if (available.length === 0) {
        setUsedOrders(new Set());
        return;
      }

      const random =
        available[Math.floor(Math.random() * available.length)];

      setCurrentPopup(random);

      // Marca como usado
      setUsedOrders((prev) => new Set(prev).add(random.id));

      // Ocultar popup depois de 5s
      setTimeout(() => {
        setCurrentPopup(null);
      }, 5000);
    }, 20000);

    return () => clearInterval(interval);
  }, [latestOrders, usedOrders]);

  // 🔥 Timer oferta
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAdd = () => {
    if (!product) return;
    addToCart({
      ...product,
      image_url: formatMedia(product.images?.[0]),
    });
  };

  const handleBuy = () => {
    handleAdd();
    navigate("/cart");
  };

  if (loading) return <div className={styles.loading}>Carregando produto...</div>;
  if (!product) return <div className={styles.error}>Produto não encontrado</div>;

  const isOutOfStock = product.stock === 0;

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* GALERIA */}
        <div className={styles.gallery}>
          <div className={styles.mainImageContainer}>
            {showVideo && product.video_url ? (
              <video
                src={formatMedia(product.video_url)}
                controls
                autoPlay
                className={styles.mainVideo}
              />
            ) : (
              <img src={selectedImage} alt={product.name} className={styles.mainImage} />
            )}
          </div>

          <div className={styles.thumbnails}>
            {product.images?.map((img, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${
                  !showVideo && selectedImage === formatMedia(img)
                    ? styles.active
                    : ""
                }`}
                onClick={() => {
                  setSelectedImage(formatMedia(img));
                  setShowVideo(false);
                }}
              >
                <img src={formatMedia(img)} alt={`Imagem ${index + 1}`} />
              </div>
            ))}

            {product.video_url && (
              <div
                className={`${styles.thumbnail} ${showVideo ? styles.active : ""}`}
                onClick={() => setShowVideo(true)}
              >
                <div className={styles.videoThumb}>▶</div>
              </div>
            )}
          </div>
        </div>

        {/* INFO PRODUTO */}
        <div className={styles.productInfo}>
          <h1 className={styles.title}>🔥 {product.name}</h1>

          <p className={styles.priceHighlight}>
            {Number(product.price).toLocaleString("pt-AO")} Kz
          </p>

          <div className={styles.badges}>
            <span>💳 Pagamento Expresso</span>
            <span>🚚 Entrega rápida em Angola</span>
            <span>📦 Entrega discreta</span>
          </div>

          <p>
            {isOutOfStock ? (
              <span className={styles.outStock}>❌ Produto esgotado</span>
            ) : (
              <span className={styles.stock}>✔ Em estoque ({product.stock} unidades)</span>
            )}
          </p>

          <div className={styles.description}>
            <p>{product.description}</p>
          </div>

          {!isOutOfStock && (
            <div className={styles.flashSale}>
              <div className={styles.flashHeader}>🔥 OFERTA RELÂMPAGO</div>

              <div className={styles.countdownBox}>
                <div className={styles.timeBlock}>
                  {Math.floor(timeLeft / 60).toString().padStart(2, "0")}
                </div>
                <span className={styles.separator}>:</span>
                <div className={styles.timeBlock}>
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </div>
              </div>

              {product.stock <= 5 && (
                <div className={styles.lowStockStrong}>
                  🚨 Restam apenas {product.stock} unidades!
                </div>
              )}
            </div>
          )}

          <div className={styles.buttons}>
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={styles.cartButton}
            >
              🛒 Adicionar ao Carrinho
            </button>

            <button
              onClick={handleBuy}
              disabled={isOutOfStock}
              className={styles.buyButtonStrong}
            >
              ⚡ Comprar Agora – Receber em Casa
            </button>
          </div>

          <div className={styles.securityBox}>
            🔐 Compra 100% segura | Atendimento via WhatsApp
          </div>
        </div>
      </div>

      {/* 🔥 POPUP SOCIAL PROOF */}
      {currentPopup && (
        <div className={`${styles.socialProof} ${styles.fade}`}>
          🛍 {currentPopup.first_name} em {currentPopup.city} comprou{" "}
          {currentPopup.product_name} às {new Date(currentPopup.created_at).toLocaleTimeString("pt-AO")}
        </div>
      )}
    </MainLayout>
  );
}