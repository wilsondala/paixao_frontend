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

function isGenericSearchTerm(term) {
  const normalized = normalizeText(term);

  const genericTerms = new Set([
    "",
    "todos",
    "tudo",
    "todo",
    "todas",
    "todos os produtos",
    "todos os modelos",
    "ver tudo",
    "ver todos",
    "mostrar tudo",
    "mostrar todos",
    "all",
    "produtos",
    "modelos",
  ]);

  return genericTerms.has(normalized);
}

function matchesText(product, term) {
  if (!term || isGenericSearchTerm(term)) return true;

  const normalizedTerm = normalizeText(term);

  const fields = [
    product?.name,
    product?.description,
    product?.category,
    product?.subcategory,
  ];

  return fields.some((field) =>
    normalizeText(field).includes(normalizedTerm)
  );
}

function matchesCategory(productCategory, selectedCategory) {
  if (!selectedCategory) return true;

  const productCat = normalizeText(productCategory);
  const selectedCat = normalizeText(selectedCategory);

  const aliases = {
    roupas: ["roupa", "roupas"],
    perfumaria: ["perfumaria", "beleza"],
    calcados: ["calcados", "calçados", "calcado", "calçado"],
    praia: ["praia"],
    outros: ["outros", "outro"],
    atacado: ["atacado"],
    kits: ["kits", "kit"],
  };

  const selectedGroup = aliases[selectedCat] || [selectedCat];
  return selectedGroup.includes(productCat);
}

function matchesSubcategory(productSubcategory, selectedSubcategory) {
  if (!selectedSubcategory) return true;

  const productSub = normalizeText(productSubcategory);
  const selectedSub = normalizeText(selectedSubcategory);

  const aliases = {
    oleo: ["oleo", "óleo"],
    hidratante: ["hidratante", "hidratantes"],
    perfume: ["perfume", "perfumes"],
    kit: ["kit", "kits"],
    feminino: ["feminino", "feminina"],
    masculino: ["masculino", "masculina"],
    infantil: ["infantil"],
    lote: ["lote", "lotes"],
    revenda: ["revenda"],
    diversos: ["diversos", "diverso"],
  };

  const selectedGroup = aliases[selectedSub] || [selectedSub];
  return selectedGroup.includes(productSub);
}

// ⭐ componente simples de estrelas
function Stars({ value, count }) {
  const v = Number(value);
  const c = Number(count);

  if (!Number.isFinite(v) || v <= 0 || !Number.isFinite(c) || c <= 0) {
    return (
      <div style={{ marginTop: 6, color: "#777", fontSize: 12 }}>
        Sem avaliações
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

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const category = params.get("category") || "";
  const subcategory = params.get("subcategory") || "";
  const q = params.get("q") || "";
  const isWholesale = params.get("is_wholesale") === "true";
  const isKit = params.get("is_kit") === "true";

  const categories = [
    {
      label: "Todos",
      action: () => navigate("/products"),
      emoji: "🛍️",
    },
    {
      label: "Atacado",
      action: () => navigate("/products?is_wholesale=true"),
      emoji: "📦",
      active: isWholesale,
    },
    {
      label: "Kits",
      action: () => navigate("/products?is_kit=true"),
      emoji: "🎁",
      active: isKit,
    },
    {
      label: "Hidratante",
      action: () =>
        navigate("/products?category=Perfumaria&subcategory=Hidratante"),
      emoji: "🧴",
      active:
        normalizeText(category) === "perfumaria" &&
        normalizeText(subcategory) === "hidratante",
    },
    {
      label: "Óleo",
      action: () =>
        navigate("/products?category=Perfumaria&subcategory=Óleo"),
      emoji: "✨",
      active:
        normalizeText(category) === "perfumaria" &&
        normalizeText(subcategory) === "oleo",
    },
    {
      label: "Roupas",
      action: () => navigate("/products?category=Roupas"),
      emoji: "👗",
      active: normalizeText(category) === "roupas",
    },
    {
      label: "Calçados",
      action: () => navigate("/products?category=Calçados"),
      emoji: "👟",
      active:
        normalizeText(category) === "calcados" ||
        normalizeText(category) === "calçados" ||
        normalizeText(category) === "calcado" ||
        normalizeText(category) === "calçado",
    },
    {
      label: "Praia",
      action: () => navigate("/products?category=Praia"),
      emoji: "🏖️",
      active: normalizeText(category) === "praia",
    },
    {
      label: "Outros",
      action: () => navigate("/products?category=Outros"),
      emoji: "✨",
      active: normalizeText(category) === "outros",
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts();
      const data = response?.data || [];

      setProducts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar produtos.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const okCategory = matchesCategory(product.category, category);
      const okSubcategory = matchesSubcategory(product.subcategory, subcategory);
      const okWholesale = isWholesale ? product.is_wholesale === true : true;
      const okKit = isKit ? product.is_kit === true : true;
      const okSearch = matchesText(product, q);

      return okCategory && okSubcategory && okWholesale && okKit && okSearch;
    });
  }, [products, category, subcategory, isWholesale, isKit, q]);

  const clearFilters = () => navigate("/products");

  const title = useMemo(() => {
    if (q && !isGenericSearchTerm(q)) return `Resultado para "${q}"`;
    if (isWholesale) return "Produtos no Atacado";
    if (isKit) return "Apenas Kits";
    if (subcategory && category) return `${subcategory} - ${category}`;
    if (category) return category;
    return "Todos os Produtos";
  }, [q, isWholesale, isKit, subcategory, category]);

  return (
    <div className={styles.page}>
      <section className={styles.categoriesSection}>
        <div className={styles.categoriesHeader}>
          <div>
            <h2>Categorias</h2>
            <p className={styles.subtitle}>
              Navegue por setor e encontre o produto ideal
            </p>
          </div>

          {(category || subcategory || isWholesale || isKit || q) && (
            <button onClick={clearFilters} className={styles.clearBtn}>
              Limpar filtros
            </button>
          )}
        </div>

        <div className={styles.categoriesRow}>
          {categories.map((item) => {
            const isActive =
              item.label === "Todos"
                ? !category && !subcategory && !isWholesale && !isKit && !q
                : !!item.active;

            return (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className={`${styles.categoryCard} ${isActive ? styles.active : ""}`}
              >
                <div className={styles.icon}>{item.emoji}</div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <div>
            <h2 className={styles.productsTitle}>{title}</h2>
            <p className={styles.resultsCount}>
              {filteredProducts.length} produto(s) encontrado(s)
            </p>
          </div>
        </div>

        {loading && <p className={styles.center}>Carregando...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className={styles.emptyState}>
            <h3>Nenhum produto encontrado</h3>
            <p>
              Tente mudar a categoria, remover filtros ou buscar outro termo.
            </p>
            <button type="button" className={styles.clearBtn} onClick={clearFilters}>
              Ver todos os produtos
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
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

                  <div className={styles.badges}>
                    {product.is_kit && <span className={styles.badge}>KIT</span>}
                    {product.is_wholesale && (
                      <span className={styles.badgeSecondary}>ATACADO</span>
                    )}
                  </div>
                </div>

                <div className={styles.info}>
                  <div className={styles.meta}>
                    {product.category && (
                      <span className={styles.metaTag}>{product.category}</span>
                    )}
                    {product.subcategory && (
                      <span className={styles.metaTag}>{product.subcategory}</span>
                    )}
                  </div>

                  <h3>{product.name}</h3>

                  <Stars
                    value={product.rating_avg ?? product.rating ?? product.stars}
                    count={product.rating_count ?? product.reviews_count ?? 0}
                  />

                  <p className={styles.price}>
                    R$ {Number(product.price || 0).toFixed(2)}
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