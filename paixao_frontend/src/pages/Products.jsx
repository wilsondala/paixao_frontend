import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProducts } from "../services/productService";
import styles from "./Products.module.css";
import { formatMedia } from "../utils/media";
import MainLayout from "../layouts/MainLayout";

function normalizeText(value) {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove acentos
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const category = params.get("category");
  const subcategory = params.get("subcategory");
  const isWholesale = params.get("is_wholesale") === "true";
  const isKit = params.get("is_kit") === "true";

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FILTRO (category + subcategory + atacado + kit) - memoizado
  const filteredProducts = useMemo(() => {
    const cat = normalizeText(category);
    const sub = normalizeText(subcategory);

    return (products || []).filter((p) => {
      const okCategory = category
        ? normalizeText(p.category) === cat
        : true;

      const okSub = subcategory
        ? normalizeText(p.subcategory) === sub
        : true;

      const okWholesale = isWholesale ? p.is_wholesale === true : true;
      const okKit = isKit ? p.is_kit === true : true;

      return okCategory && okSub && okWholesale && okKit;
    });
  }, [products, category, subcategory, isWholesale, isKit]);

  const titleText = useMemo(() => {
    if (isWholesale) return "Produtos - Atacado";
    if (isKit) return "Produtos - Kits";
    if (category && subcategory) return `Produtos - ${category} / ${subcategory}`;
    if (category) return `Produtos - ${category}`;
    return "Nossos Produtos";
  }, [category, subcategory, isWholesale, isKit]);

  return (
    <MainLayout>
      <div className={styles.page}>
        {/* ================= HERO ================= */}
        <section className={styles.hero}>
          <div
            className={styles.heroSlide}
            style={{ backgroundImage: `url('/imagem/produtos/kitavelã.JPG')` }}
          >
            <div className={styles.overlay}></div>

            <div className={styles.heroContent}>
              <h1>Descubra a Paixão</h1>
              <p>Óleos e loções corporais com fragrâncias irresistíveis</p>
              <Link to="/products" className={styles.heroButton}>
                Ver Todos os Produtos
              </Link>
            </div>
          </div>
        </section>

        {/* ================= PRODUTOS ================= */}
        <section className={styles.main}>
          <h2 className={styles.title}>{titleText}</h2>

          {loading && <p className={styles.center}>Carregando produtos...</p>}
          {error && <p className={styles.error}>{error}</p>}

          {!loading && !error && (
            <div className={styles.grid}>
              {filteredProducts.length === 0 ? (
                <p className={styles.center}>
                  Nenhum produto encontrado para este filtro.
                </p>
              ) : (
                filteredProducts.map((product) => {
                  const wholesalePrice = product.wholesale_price;
                  const hasWholesalePrice =
                    wholesalePrice !== null &&
                    wholesalePrice !== undefined &&
                    wholesalePrice !== "" &&
                    !Number.isNaN(Number(wholesalePrice));

                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className={styles.card}
                    >
                      <div className={styles.imageContainer}>
                        <img
                          src={formatMedia(product.images?.[0]) || "/placeholder.png"}
                          alt={product.name}
                          className={styles.image}
                        />

                        {/* Badges */}
                        {product.is_kit && (
                          <span className={styles.badgeKit}>KIT</span>
                        )}
                        {product.is_wholesale && (
                          <span className={styles.badgeWholesale}>ATACADO</span>
                        )}
                      </div>

                      <div className={styles.info}>
                        <h3>{product.name}</h3>

                        <p className={styles.price}>
                          R$ {Number(product.price).toFixed(2)}
                        </p>

                        {product.is_wholesale && hasWholesalePrice && (
                          <p className={styles.wholesalePrice}>
                            Atacado: R$ {Number(wholesalePrice).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}