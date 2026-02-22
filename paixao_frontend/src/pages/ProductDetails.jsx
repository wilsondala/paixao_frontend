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
                  !showVideo && selectedImage === formatMedia(img) ? styles.active : ""
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

        {/* Informações */}
        <div className={styles.productInfo}>
          <h1>{product.name}</h1>
          <p className={styles.price}>
            {Number(product.price).toLocaleString("pt-AO")} Kz
          </p>

          <p>
            {isOutOfStock ? (
              <span className={styles.outStock}>❌ Produto esgotado</span>
            ) : (
              <span className={styles.stock}>
                ✔ Em estoque ({product.stock} unidades)
              </span>
            )}
          </p>

          <div className={styles.description}>
            <p>{product.description}</p>
          </div>

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
              className={styles.buyButton}
            >
              ⚡ Comprar Agora
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}