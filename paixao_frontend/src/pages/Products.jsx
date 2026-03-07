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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const category = params.get("category") || "";
  const subcategory = params.get("subcategory") || "";
  const q = params.get("q") || "";
  const isWholesale = params.get("is_wholesale") === "true";
  const isKit = params.get("is_kit") === "true";

  const apiFilters = useMemo(() => {
    const filters = {};

    if (category) filters.category = category;
    if (subcategory) filters.subcategory = subcategory;
    if (isWholesale) filters.is_wholesale = true;
    if (isKit) filters.is_kit = true;
    if (q && !isGenericSearchTerm(q)) filters.q = q;

    return filters;
  }, [category, subcategory, isWholesale, isKit, q]);

  const mainCategories = [
    { label: "Todos", value: "" },
    { label: "Roupas", value: "Roupas" },
    { label: "Perfumaria", value: "Perfumaria" },
    { label: "Calçados", value: "Calçados" },
    { label: "Praia", value: "Praia" },
    { label: "Outros", value: "Outros" },
  ];

  const subcategoryOptions = useMemo(() => {
    const normalizedCategory = normalizeText(category);

    if (normalizedCategory === "perfumaria") {
      return ["Óleo", "Hidratante", "Perfume", "Kit"];
    }

    if (normalizedCategory === "roupas") {
      return ["Feminino", "Masculino", "Infantil"];
    }

    if (
      normalizedCategory === "calcados" ||
      normalizedCategory === "calçados" ||
      normalizedCategory === "calcado" ||
      normalizedCategory === "calçado"
    ) {
      return ["Feminino", "Masculino", "Infantil"];
    }

    if (normalizedCategory === "praia") {
      return ["Biquíni", "Saída de Praia", "Chinelo", "Acessórios"];
    }

    if (normalizedCategory === "outros") {
      return ["Diversos"];
    }

    return [];
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await getProducts(apiFilters);
        const data = response?.data || [];

        setProducts(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar produtos.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiFilters]);

  useEffect(() => {
    setShowMobileFilters(false);
  }, [location.search]);

  const updateFilter = (updates = {}) => {
    const next = new URLSearchParams(location.search);

    Object.entries(updates).forEach(([key, value]) => {
      const stringValue = value == null ? "" : String(value).trim();

      if (!stringValue) {
        next.delete(key);
      } else {
        next.set(key, stringValue);
      }
    });

    navigate(`/products${next.toString() ? `?${next.toString()}` : ""}`);
  };

  const handleCategoryChange = (value) => {
    if (!value) {
      const next = new URLSearchParams(location.search);
      next.delete("category");
      next.delete("subcategory");
      navigate(`/products${next.toString() ? `?${next.toString()}` : ""}`);
      return;
    }

    updateFilter({
      category: value,
      subcategory: "",
    });
  };

  const handleSubcategoryChange = (value) => {
    updateFilter({ subcategory: value });
  };

  const handleWholesaleChange = () => {
    updateFilter({ is_wholesale: isWholesale ? "" : "true" });
  };

  const handleKitChange = () => {
    updateFilter({ is_kit: isKit ? "" : "true" });
  };

  const clearFilters = () => navigate("/products");

  const title = useMemo(() => {
    if (q && !isGenericSearchTerm(q)) return `Resultado para "${q}"`;
    if (isWholesale) return "Produtos no Atacado";
    if (isKit) return "Apenas Kits";
    if (subcategory && category) return `${subcategory} - ${category}`;
    if (category) return category;
    return "Todos os Produtos";
  }, [q, isWholesale, isKit, subcategory, category]);

  const hasActiveFilters =
    !!category || !!subcategory || isWholesale || isKit || (!!q && !isGenericSearchTerm(q));

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <aside
          className={`${styles.sidebar} ${
            showMobileFilters ? styles.sidebarOpen : ""
          }`}
        >
          <div className={styles.sidebarHeader}>
            <div>
              <h2>Filtros</h2>
              <p>Refine sua busca com facilidade</p>
            </div>

            {hasActiveFilters && (
              <button type="button" className={styles.clearBtn} onClick={clearFilters}>
                Limpar filtros
              </button>
            )}
          </div>

          <div className={styles.filterGroup}>
            <h3>Categorias</h3>

            <div className={styles.filterOptions}>
              {mainCategories.map((item) => {
                const active = item.value
                  ? normalizeText(category) === normalizeText(item.value)
                  : !category;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleCategoryChange(item.value)}
                    className={`${styles.filterOptionBtn} ${
                      active ? styles.filterOptionActive : ""
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {subcategoryOptions.length > 0 && (
            <div className={styles.filterGroup}>
              <h3>Subcategorias</h3>

              <div className={styles.filterOptions}>
                <button
                  type="button"
                  onClick={() => handleSubcategoryChange("")}
                  className={`${styles.filterOptionBtn} ${
                    !subcategory ? styles.filterOptionActive : ""
                  }`}
                >
                  Todas
                </button>

                {subcategoryOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSubcategoryChange(item)}
                    className={`${styles.filterOptionBtn} ${
                      normalizeText(subcategory) === normalizeText(item)
                        ? styles.filterOptionActive
                        : ""
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.filterGroup}>
            <h3>Especiais</h3>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={isWholesale}
                onChange={handleWholesaleChange}
              />
              <span>Somente atacado</span>
            </label>

            <label className={styles.checkboxRow}>
              <input type="checkbox" checked={isKit} onChange={handleKitChange} />
              <span>Somente kits</span>
            </label>
          </div>
        </aside>

        <section className={styles.content}>
          <div className={styles.mobileActions}>
            <button
              type="button"
              className={styles.mobileFilterBtn}
              onClick={() => setShowMobileFilters((prev) => !prev)}
            >
              {showMobileFilters ? "Fechar filtros" : "Mostrar filtros"}
            </button>

            {hasActiveFilters && (
              <button type="button" className={styles.clearBtn} onClick={clearFilters}>
                Limpar filtros
              </button>
            )}
          </div>

          <div className={styles.productsHeader}>
            <div>
              <h2 className={styles.productsTitle}>{title}</h2>
              <p className={styles.resultsCount}>
                {products.length} produto(s) encontrado(s)
              </p>
            </div>
          </div>

          {loading && <p className={styles.center}>Carregando...</p>}
          {error && <p className={styles.error}>{error}</p>}

          {!loading && !error && products.length === 0 && (
            <div className={styles.emptyState}>
              <h3>Nenhum produto encontrado</h3>
              <p>
                Tente mudar a categoria, remover filtros ou buscar outro termo.
              </p>
              <button
                type="button"
                className={styles.clearBtn}
                onClick={clearFilters}
              >
                Ver todos os produtos
              </button>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className={styles.grid}>
              {products.map((product) => (
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
    </div>
  );
}