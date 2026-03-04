import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getProductById, getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";
import styles from "./ProductDetails.module.css";
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

// ⭐ componente simples de estrelas (sem depender de CSS extra)
function Stars({ value, count }) {
  const v = Number(value);
  const c = Number(count);

  if (!Number.isFinite(v) || v <= 0 || !Number.isFinite(c) || c <= 0) {
    return (
      <div style={{ marginTop: 6, color: "#666", fontSize: 13 }}>
        Sem avaliações ainda
      </div>
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
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
      <span style={{ fontSize: 14 }}>{stars}</span>
      <span style={{ fontSize: 12, color: "#666" }}>
        {clamped.toFixed(1)} ({c})
      </span>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);

  // ✅ midia selecionada pode ser "image" ou "video"
  const [selected, setSelected] = useState(null); // { type: "image"|"video", src: "..." }

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ relacionados
  const [related, setRelated] = useState([]);

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

      // ✅ define seleção inicial:
      const videoSrc = formatVideo(data?.video_url);
      const firstImage = data?.images?.[0];

      if (videoSrc) {
        setSelected({ type: "video", src: videoSrc });
      } else if (firstImage) {
        setSelected({ type: "image", src: firstImage });
      } else {
        setSelected(null);
      }

      setError(null);

      // ✅ carrega relacionados (mesma categoria, exceto o atual)
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
            {/* ✅ mantém o layout original (gallery + info) */}
            <div className={styles.gallery}>
              {/* ✅ MAIN VIEWER */}
              <div className={styles.mainImage}>
                {selected?.type === "video" ? (
                  <video
                    src={selected.src}
                    controls
                    preload="metadata"
                    style={{ width: "100%", height: "100%", borderRadius: 16 }}
                  />
                ) : (
                  <img src={formatMedia(selected?.src)} alt={product.name} />
                )}
              </div>

              {/* ✅ THUMBNAILS */}
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
                        className={`${styles.thumbnail} ${
                          isActive ? styles.active : ""
                        }`}
                        style={{
                          position: "relative",
                          padding: 0,
                          border: "none",
                          background: "transparent",
                        }}
                        aria-label="Ver vídeo"
                        title="Ver vídeo"
                      >
                        <video
                          src={m.src}
                          preload="metadata"
                          muted
                          playsInline
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 10,
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 22,
                            color: "white",
                            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                            pointerEvents: "none",
                          }}
                        >
                          ▶
                        </span>
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

            <div className={styles.info}>
              <h2>{product.name}</h2>

              <p className={styles.price}>
                R$ {Number(product.price).toFixed(2)}
              </p>

              {/* ⭐ Avaliação */}
              <Stars
                value={product.rating_avg ?? product.rating ?? product.stars}
                count={product.rating_count ?? product.reviews_count ?? 0}
              />

              <p className={styles.description}>{product.description}</p>

              {/* ✅ botões lado a lado sem CSS novo */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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
          </>
        )}
      </div>

      {/* ✅ Relacionados sempre embaixo (sem mexer no layout do container) */}
      {!loading && product && related.length > 0 && (
        <section
          style={{
            maxWidth: 1200,
            margin: "0 auto 70px",
            padding: "0 20px",
          }}
        >
          <h3 style={{ margin: "10px 0 16px" }}>Produtos relacionados</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
            }}
          >
            {related.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate(`/products/${p.id}`)}
                style={{
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 14,
                  background: "white",
                  padding: 10,
                  textAlign: "left",
                  cursor: "pointer",
                }}
                title={p.name}
              >
                <div
                  style={{
                    width: "100%",
                    height: 140,
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "#f1f1f1",
                    marginBottom: 10,
                  }}
                >
                  <img
                    src={formatMedia(p.images?.[0]) || "/placeholder.png"}
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                  <span style={{ fontSize: 13 }}>
                    R$ {Number(p.price).toFixed(2)}
                  </span>

                  {/* ⭐ avaliação no card também */}
                  <Stars
                    value={p.rating_avg ?? p.rating ?? p.stars}
                    count={p.rating_count ?? p.reviews_count ?? 0}
                  />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}