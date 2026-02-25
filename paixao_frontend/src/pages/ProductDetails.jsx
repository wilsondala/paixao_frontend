import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import styles from "./ProductDetails.module.css";
import { formatMedia } from "../utils/media";
import MainLayout from "../layouts/MainLayout";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(id);
      setProduct(response.data);
      setSelectedImage(response.data.images?.[0]);
    } catch (err) {
      setError("Produto não encontrado.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className={styles.center}>Carregando...</p>;
  if (error) return <p className={styles.center}>{error}</p>;
  if (!product) return null;

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img
              src={formatMedia(selectedImage)}
              alt={product.name}
            />
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
          <h1>{product.name}</h1>

          <p className={styles.price}>
            R$ {Number(product.price).toFixed(2)}
          </p>

          <p className={styles.description}>
            {product.description}
          </p>

          <button className={styles.buyButton}>
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </MainLayout>
  );
}