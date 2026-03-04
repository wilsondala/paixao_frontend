import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import styles from "./Products.module.css";
import { formatMedia } from "../utils/media";

function normalizeText(value) {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ⭐ componente simples de estrelas (sem CSS extra)
function Stars({ value, count }) {
  const v = Number(value);
  const c = Number(count);

  if (!Number.isFinite(v) || v <= 0 || !Number.isFinite(c) || c <= 0) {
    return <div style={{ marginTop: 6, color: "#777", fontSize: 12 }}>Sem avaliações</div>;
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
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
      <span style={{ fontSize: 13 }}>{stars}</span>
      <span style={{ fontSize: 11, color: "#666" }}>
        {clamped.toFixed(1)} ({c})
      </span>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const category = params.get("category");
  const isWholesale = params.get("is_wholesale") === "true";
  const isKit = params.get("is_kit") === "true";

  const categories = [
    { label: "Roupas", value: "Roupas", emoji: "👗" },
    { label: "Perfumaria", value: "Beleza", emoji: "🧴" },
    { label: "Calçados", value: "Calçado", emoji: "👟" },
    { label: "Praia", value: "Praia", emoji: "🏖️" },
    { label: "Outros", value: "Outros", emoji: "✨" },
    { label: "Atacado", query: "is_wholesale=true", emoji: "📦" },
    { label: "Kits", query: "is_kit=true", emoji: "🎁" },
  ];

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts();
      const data = response?.data || [];

      setProducts(data);
      setError(null);

      if (data.length) {
        console.log("PRIMEIRO PRODUTO:", data[0]);
        console.log("IMAGES RAW:", data[0].images);
        console.log("COVER:", formatMedia(data[0].images?.[0]));
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar produtos.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const cat = normalizeText(category);

    return products.filter((p) => {
      const okCategory = category ? normalizeText(p.category) === cat : true;
      const okWholesale = isWholesale ? p.is_wholesale === true : true;
      const okKit = isKit ? p.is_kit === true : true;

      return okCategory && okWholesale && okKit;
    });
  }, [products, category, isWholesale, isKit]);

  const goCategory = (catItem) => {
    const newParams = new URLSearchParams();

    if (catItem.query) {
      const [k, v] = catItem.query.split("=");
      newParams.set(k, v);
    } else if (catItem.value) {
      newParams.set("category", catItem.value);
    }

    navigate(`/products?${newParams.toString()}`);
  };

  const clearFilters = () => navigate("/products");

  return (
    <div className={styles.page}>
      {/* ================= CATEGORIAS ================= */}
      <section className={styles.categoriesSection}>
        <div className={styles.categoriesHeader}>
          <h2>Categorias</h2>
          {(category || isWholesale || isKit) && (
            <button onClick={clearFilters} className={styles.clearBtn}>
              Limpar filtros
            </button>
          )}
        </div>

        <div className={styles.categoriesRow}>
          {categories.map((c) => {
            const active =
              (c.value && c.value === category) ||
              (c.query === "is_wholesale=true" && isWholesale) ||
              (c.query === "is_kit=true" && isKit);

            return (
              <button
                key={c.label}
                onClick={() => goCategory(c)}
                className={`${styles.categoryCard} ${active ? styles.active : ""}`}
              >
                <div className={styles.icon}>{c.emoji}</div>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= PRODUTOS ================= */}
      <section className={styles.productsSection}>
        {loading && <p className={styles.center}>Carregando...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <div className={styles.grid}>
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className={styles.card}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={formatMedia(product.images?.[0]) || "/placeholder.png"}
                    alt={product.name}
                  />

                  {product.is_kit && <span className={styles.badge}>KIT</span>}
                </div>

                <div className={styles.info}>
                  <h3>{product.name}</h3>

                  {/* ⭐ avaliação no card */}
                  <Stars
                    value={product.rating_avg ?? product.rating ?? product.stars}
                    count={product.rating_count ?? product.reviews_count ?? 0}
                  />

                  <p className={styles.price}>
                    R$ {Number(product.price).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}