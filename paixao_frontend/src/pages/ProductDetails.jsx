import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { getProductById, getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";
import styles from "./ProductDetails.module.css";
import ProductReview from "../components/ProductReview";
import { formatMedia } from "../utils/media";

// ✅ formata URL de vídeo (parecido com formatMedia)
function formatVideo(file) {
  if (!file) return "";

  if (Array.isArray(file)) file = file[0];

  if (typeof file === "string" && file.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(file);
      if (Array.isArray(parsed) && parsed.length > 0) file = parsed[0];
    } catch (err) {
      console.warn("Erro ao converter JSON de vídeo:", err);
    }
  }

  file = String(file).trim();
  if (!file) return "";

  if (file.startsWith("http://") || file.startsWith("https://")) return file;
  if (file.startsWith("/")) return file;

  if (file.startsWith("uploads/")) return `/${file}`;
  if (file.startsWith("produtos/")) return `/uploads/${file}`;

  return `/uploads/produtos/${file}`;
}

// ⭐ estrelas (clicável)
function Stars({ value, count, onClick }) {
  const v = Number(value);
  const c = Number(count);

  const hasReviews = Number.isFinite(v) && v > 0 && Number.isFinite(c) && c > 0;

  if (!hasReviews) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={styles.starsBtn}
        title="Ver avaliações"
      >
        Sem avaliações ainda • Ver avaliações
      </button>
    );
  }

  const clamped = Math.max(0, Math.min(5, v));
  const full = Math.floor(clamped);
  const half = clamped - full >= 0.5;

  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "★";
    if (i === full && half) return "⯪";
    return "☆";
  }).join("");

  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.starsBtn}
      title="Ver avaliações"
    >
      <span className={styles.starsIcon}>{stars}</span>
      <span className={styles.starsText}>
        {clamped.toFixed(1)} ({c}) • Ver avaliações
      </span>
    </button>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selected, setSelected] = useState(null); // { type, src }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ relacionados
  const [related, setRelated] = useState([]);

  // ✅ avaliações
  const [showReviews, setShowReviews] = useState(false);
  const reviewsRef = useRef(null);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await getProductById(id);
      const data = response.data;

      setProduct(data);

      // ✅ seleção inicial
      const videoSrc = formatVideo(data?.video_url);
      const firstImage = data?.images?.[0];

      if (videoSrc) setSelected({ type: "video", src: videoSrc });
      else if (firstImage) setSelected({ type: "image", src: firstImage });
      else setSelected(null);

      setError(null);

      // ✅ relacionados (mesma categoria)
      try {
        const listRes = await getProducts();
        const all = Array.isArray(listRes.data) ? listRes.data : [];
        const currentCat = String(data?.category || "").trim().toLowerCase();

        const filtered = all
          .filter((p) => String(p?.id) !== String(data?.id))
          .filter((p) => {
            const cat = String(p?.category || "").trim().toLowerCase();
            return currentCat ? cat === currentCat : true;
          })
          .slice(0, 8);

        setRelated(filtered);
      } catch (err) {
        console.warn("Não foi possível carregar relacionados:", err);
        setRelated([]);
      }
    } catch (err) {
      console.error(err);
      setError("Produto não encontrado.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ lista de mídias (vídeo + imagens)
  const mediaItems = useMemo(() => {
    if (!product) return [];

    const items = [];
    const v = formatVideo(product.video_url);
    if (v) items.push({ type: "video", src: v });

    const imgs = Array.isArray(product.images) ? product.images : [];
    imgs.forEach((img) => {
      if (String(img || "").trim()) items.push({ type: "image", src: img });
    });

    return items;
  }, [product]);

  const heroBg = useMemo(() => {
    const img = product?.images?.[0];
    return img ? `url(${formatMedia(img)})` : "none";
  }, [product]);

  // ✅ abre avaliações e rola
  const openReviews = () => {
    setShowReviews(true);
    setTimeout(() => {
      reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  // ✅ fallback rating
  const ratingAvg = product?.rating_avg ?? 0;
  const ratingCount = product?.rating_count ?? 0;

  // ✅ submit avaliação (aqui depois você integra no backend)
  const handleSubmitReview = (review) => {
    console.log("Avaliação enviada:", review);

    // Exemplo (futuro): chamar API e depois recarregar
    // await createReview(id, review)
    // await fetchProduct()
  };

  return (
    <div className={styles.page}>
      {/* ================= HERO ================= */}
      {product && (
        <div className={styles.hero} style={{ backgroundImage: heroBg }}>
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
            <div className={styles.contentRow}>
              {/* ====== GALERIA ====== */}
              <div className={styles.gallery}>
                <div className={styles.mainImage}>
                  {selected?.type === "video" ? (
                    <video
                      src={selected.src}
                      controls
                      preload="metadata"
                      className={styles.video}
                    />
                  ) : (
                    <img src={formatMedia(selected?.src)} alt={product.name} />
                  )}
                </div>

                <div className={styles.thumbnailContainer}>
                  {mediaItems.map((m, index) => {
                    const isActive =
                      selected?.type === m.type &&
                      String(selected?.src) === String(m.src);

                    if (m.type === "video") {
                      return (
                        <button
                          key={`video-${index}`}
                          type="button"
                          onClick={() => setSelected(m)}
                          className={`${styles.thumbBtn} ${
                            isActive ? styles.active : ""
                          }`}
                          aria-label="Ver vídeo"
                          title="Ver vídeo"
                        >
                          <video
                            src={m.src}
                            preload="metadata"
                            muted
                            playsInline
                            className={styles.thumbVideo}
                          />
                          <span className={styles.playIcon}>▶</span>
                        </button>
                      );
                    }

                    return (
                      <img
                        key={`img-${index}`}
                        src={formatMedia(m.src)}
                        alt="thumb"
                        onClick={() => setSelected(m)}
                        className={`${styles.thumbnail} ${
                          isActive ? styles.active : ""
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* ====== INFO ====== */}
              <div className={styles.info}>
                <h2>{product.name}</h2>

                <p className={styles.price}>R$ {Number(product.price).toFixed(2)}</p>

                {/* ⭐ Avaliações clicáveis */}
                <Stars value={ratingAvg} count={ratingCount} onClick={openReviews} />

                <p className={styles.description}>{product.description}</p>

                <div className={styles.actions}>
                  <button
                    className={styles.buyButton}
                    onClick={() => addToCart(product)}
                  >
                    Adicionar ao Carrinho
                  </button>

                  <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => navigate("/products")}
                  >
                    Voltar para compras
                  </button>
                </div>
              </div>
            </div>

            {/* ✅ AVALIAÇÕES ABAIXO DO PRODUTO */}
            <section ref={reviewsRef} className={styles.reviewsSection}>
              <div className={styles.reviewsHeader}>
                <h3>Avaliações</h3>

                <button
                  type="button"
                  className={styles.toggleReviewsBtn}
                  onClick={() => setShowReviews((p) => !p)}
                >
                  {showReviews ? "Fechar" : "Ver"}
                </button>
              </div>

              {showReviews && (
                <div className={styles.reviewsBox}>
                  <div className={styles.reviewsMeta}>
                    <span>
                      <strong>Média:</strong> {Number(ratingAvg || 0).toFixed(1)}
                    </span>
                    <span>
                      <strong>Total:</strong> {Number(ratingCount || 0)}
                    </span>
                  </div>

                  {/* ✅ lista (quando backend devolver reviews) */}
                  {Array.isArray(product?.reviews) && product.reviews.length > 0 ? (
                    <div className={styles.reviewsList}>
                      {product.reviews.map((r, idx) => (
                        <div key={idx} className={styles.reviewItem}>
                          <div className={styles.reviewTop}>
                            <strong>{r?.name || "Cliente"}</strong>
                            <span className={styles.reviewStars}>
                              {"★".repeat(Number(r?.stars || 5)).padEnd(5, "☆")}
                            </span>
                          </div>
                          <p className={styles.reviewText}>{r?.comment || "—"}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noReviews}>
                      Este produto ainda não tem avaliações. Seja o primeiro ⭐
                    </p>
                  )}

                  {/* ✅ FORMULÁRIO DE AVALIAÇÃO (ESTRELAS + COMENTÁRIO) */}
                  <ProductReview onSubmit={handleSubmitReview} />
                </div>
              )}
            </section>

            {/* ✅ RELACIONADOS EMBAIXO */}
            {related.length > 0 && (
              <section className={styles.relatedSection}>
                <div className={styles.relatedHeader}>
                  <h3>Produtos relacionados</h3>
                </div>

                <div className={styles.relatedGrid}>
                  {related.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={styles.relatedCard}
                      onClick={() => navigate(`/products/${p.id}`)}
                      title={p.name}
                    >
                      <div className={styles.relatedImgWrap}>
                        <img
                          src={formatMedia(p.images?.[0]) || "/placeholder.png"}
                          alt={p.name}
                          className={styles.relatedImg}
                        />
                      </div>

                      <div className={styles.relatedInfo}>
                        <span className={styles.relatedName}>{p.name}</span>
                        <span className={styles.relatedPrice}>
                          R$ {Number(p.price).toFixed(2)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}