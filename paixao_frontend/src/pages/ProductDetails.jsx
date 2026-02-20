import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import styles from "./ProductDetails.module.css";
import { formatMedia } from "../utils/media";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    const response = await api.get(`/products/${id}`);
    setProduct(response.data);

    if (response.data.images?.length > 0) {
      setSelectedImage(formatMedia(response.data.images[0]));
    }
  };

  const handleAdd = () => {
    addToCart({
      ...product,
      image_url: formatMedia(product.images?.[0]),
    });
  };

  const handleBuy = () => {
    handleAdd();
    navigate("/cart");
  };

  if (!product) return <p>Carregando...</p>;

  const isOutOfStock = product.stock === 0;

  return (
    <div className={styles.container}>
      {/* GALERIA (mantida como antes) */}

      <div className={styles.productInfo}>
        <h1>{product.name}</h1>
        <p className={styles.price}>
          {Number(product.price).toLocaleString("pt-AO")} Kz
        </p>

        <p>
          {isOutOfStock ? (
            <span className={styles.outStock}>
              ❌ Produto esgotado
            </span>
          ) : (
            <span className={styles.stock}>
              ✔ Em estoque ({product.stock})
            </span>
          )}
        </p>

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
  );
}