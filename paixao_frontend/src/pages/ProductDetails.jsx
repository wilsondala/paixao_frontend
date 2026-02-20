import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import styles from "./ProductDetails.module.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addedMessage, setAddedMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const products = await getProducts();
        const found = products.find((p) => String(p.id) === id);
        setProduct(found || null);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const getFileUrl = (file) => {
    if (!file) return "/placeholder.png";
    if (file.startsWith("http")) return file;
    return `/imagem/produtos/${file}`;
  };

  if (loading) {
    return <div className={styles.loading}>Carregando produto...</div>;
  }

  if (!product) {
    return <div className={styles.loading}>Produto não encontrado.</div>;
  }

  const images = Array.isArray(product.images)
    ? product.images
    : product.image
    ? [product.image]
    : [];

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }

    addToCart(product);
    setAddedMessage("Produto adicionado ao carrinho!");

    setTimeout(() => {
      setAddedMessage("");
    }, 2500);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }

    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Voltar
      </button>

      <div className={styles.wrapper}>
        <div className={styles.imageSection}>
          <img
            src={getFileUrl(images[selectedIndex])}
            alt={product.name}
            className={styles.mainImage}
            onError={(e) => (e.target.src = "/placeholder.png")}
          />

          {images.length > 1 && (
            <div className={styles.thumbnailRow}>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={getFileUrl(img)}
                  alt="thumb"
                  className={`${styles.thumbnail} ${
                    selectedIndex === index ? styles.activeThumb : ""
                  }`}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.name}>{product.name}</h1>

          <div className={styles.price}>
            {Number(product.price).toLocaleString("pt-AO")} Kz
          </div>

          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}

          {addedMessage && (
            <div style={{ color: "green", fontWeight: "500" }}>
              {addedMessage}
            </div>
          )}

          <div className={styles.actions}>
            <button
              className={styles.addButton}
              onClick={handleAddToCart}
            >
              Adicionar ao Carrinho
            </button>

            <button
              className={styles.buyButton}
              onClick={handleBuyNow}
            >
              Comprar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}