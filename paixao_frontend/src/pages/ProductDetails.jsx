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
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
  }, 1000);

  const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
};

useEffect(() => {
  const cities = [
    "Luanda",
    "Benguela",
    "Huambo",
    "Lubango",
    "Cabinda",
    "Uíge",
    "Malanje",
  ];

  const names = [
    "Carlos",
    "Ana",
    "João",
    "Marta",
    "Paulo",
    "Sandra",
    "Nelson",
  ];

  const interval = setInterval(() => {
    const randomCity =
      cities[Math.floor(Math.random() * cities.length)];
    const randomName =
      names[Math.floor(Math.random() * names.length)];
    const randomMinutes = Math.floor(Math.random() * 10) + 1;

    setPopupData({
      name: randomName,
      city: randomCity,
      minutes: randomMinutes,
    });

    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 5000);
  }, 20000);

  return () => clearInterval(interval);
}, []);

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
      {/* Galeria */}
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
            <img
              src={selectedImage}
              alt={product.name}
              className={styles.mainImage}
            />
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
              className={`${styles.thumbnail} ${
                showVideo ? styles.active : ""
              }`}
              onClick={() => setShowVideo(true)}
            >
              <div className={styles.videoThumb}>▶</div>
            </div>
          )}
        </div>
      </div>

      {/* Informações */}
      <div className={styles.productInfo}>
        <h1 className={styles.title}>
          🔥 {product.name}
        </h1>

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
            <span className={styles.stock}>
              ✔ Em estoque ({product.stock} unidades)
            </span>
          )}
        </p>

        {/* Bloco emocional */}
        <div className={styles.highlightBox}>
          <h3>Desperte a Intensidade da Paixão</h3>
          <p>
            Experimente uma fragrância marcante, textura envolvente
            e uma sensação irresistível que transforma momentos comuns
            em experiências inesquecíveis.
          </p>
        </div>

        <div className={styles.description}>
          <p>{product.description}</p>
        </div>

        {/* OFERTA RELÂMPAGO */}
        {!isOutOfStock && (
          <div className={styles.flashSale}>
            <div className={styles.flashHeader}>
              🔥 OFERTA RELÂMPAGO
            </div>

            <div className={styles.countdownBox}>
              <div className={styles.timeBlock}>
                {Math.floor(timeLeft / 60)
                  .toString()
                  .padStart(2, "0")}
              </div>

              <span className={styles.separator}>:</span>

              <div className={styles.timeBlock}>
                {(timeLeft % 60).toString().padStart(2, "0")}
              </div>
            </div>

            <div className={styles.flashText}>
              ⚠️ Garanta agora antes que acabe!
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
    {showPopup && popupData && (
    <div className={styles.socialProof}>
      🛍 {popupData.name} em {popupData.city} comprou este produto há{" "}
      {popupData.minutes} min
    </div>
)}
  </MainLayout>
);
}