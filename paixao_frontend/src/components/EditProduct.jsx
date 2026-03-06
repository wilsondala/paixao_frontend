import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import styles from "./EditProduct.module.css";

const CATEGORY_OPTIONS = {
  Roupas: ["Feminino", "Masculino", "Infantil", "Moda Praia"],
  Perfumaria: ["Óleo", "Hidratante", "Perfume", "Kit"],
  Calçados: ["Feminino", "Masculino", "Infantil"],
  Praia: ["Biquíni", "Saída de Praia", "Chinelo", "Acessórios"],
  Outros: ["Diversos"],
  Atacado: ["Lote", "Revenda"],
  Kits: ["Kit Promocional", "Kit Presente", "Kit Beleza"],
};

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subcategory: "",
    is_wholesale: false,
    wholesale_price: "",
    is_kit: false,
    images: [],
    video_url: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchUrl = useMemo(() => `/products/${id}`, [id]);

  const subcategoryOptions = useMemo(() => {
    return CATEGORY_OPTIONS[form.category] || [];
  }, [form.category]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(fetchUrl);

        setForm({
          name: res.data?.name ?? "",
          description: res.data?.description ?? "",
          price: res.data?.price != null ? String(res.data.price) : "",
          stock: res.data?.stock != null ? String(res.data.stock) : "",
          category: res.data?.category ?? "",
          subcategory: res.data?.subcategory ?? "",
          is_wholesale: Boolean(res.data?.is_wholesale),
          wholesale_price:
            res.data?.wholesale_price != null
              ? String(res.data.wholesale_price)
              : "",
          is_kit: Boolean(res.data?.is_kit),
          images: Array.isArray(res.data?.images) ? res.data.images : [""],
          video_url: res.data?.video_url ?? "",
        });
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
        alert("Erro ao carregar produto.");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [fetchUrl, navigate]);

  useEffect(() => {
    if (!subcategoryOptions.length) return;

    const exists = subcategoryOptions.includes(form.subcategory);

    if (!exists && form.subcategory) {
      setForm((prev) => ({
        ...prev,
        subcategory: "",
      }));
    }
  }, [form.category, form.subcategory, subcategoryOptions]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "is_wholesale" && !checked) {
        updated.wholesale_price = "";
      }

      return updated;
    });
  };

  const handleAddImage = () => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const handleImageChange = (index, value) => {
    setForm((prev) => {
      const updated = [...prev.images];
      updated[index] = value;
      return { ...prev, images: updated };
    });
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => {
      const nextImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: nextImages.length ? nextImages : [""],
      };
    });
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    setVideoFile(file || null);
  };

  const toNumberSafe = (val) => {
    const n = Number(String(val).replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  };

  const normalizeImages = (arr) =>
    (Array.isArray(arr) ? arr : [])
      .map((x) => String(x || "").trim())
      .filter(Boolean);

  const normalizeVideoUrl = (raw) => {
    const v = String(raw || "").trim();
    if (!v) return null;

    if (v.startsWith("http://") || v.startsWith("https://")) return v;
    if (v.startsWith("/")) return v;
    return `/video/${v}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);

    try {
      const payloadBase = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: toNumberSafe(form.price),
        stock: toNumberSafe(form.stock),
        category: form.category.trim() || null,
        subcategory: form.subcategory.trim() || "",
        is_wholesale: form.is_wholesale,
        wholesale_price:
          form.is_wholesale && form.wholesale_price !== ""
            ? toNumberSafe(form.wholesale_price)
            : null,
        is_kit: form.is_kit,
        images: normalizeImages(form.images),
        video_url: normalizeVideoUrl(form.video_url),
      };

      const urlAdmin = `/products/${id}`;

      if (videoFile) {
        const formData = new FormData();
        formData.append("name", payloadBase.name);
        formData.append("description", payloadBase.description);
        formData.append("price", String(payloadBase.price));
        formData.append("stock", String(payloadBase.stock));

        if (payloadBase.category) formData.append("category", payloadBase.category);
        formData.append("subcategory", payloadBase.subcategory);
        formData.append("is_wholesale", String(payloadBase.is_wholesale));
        if (payloadBase.wholesale_price != null) {
          formData.append("wholesale_price", String(payloadBase.wholesale_price));
        }
        formData.append("is_kit", String(payloadBase.is_kit));

        if (payloadBase.video_url) formData.append("video_url", payloadBase.video_url);
        formData.append("video", videoFile);

        payloadBase.images.forEach((img) => formData.append("images", img));

        await api.put(urlAdmin, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.put(urlAdmin, payloadBase);
      }

      alert("Produto atualizado com sucesso!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Erro ao atualizar:", err);

      const status = err?.response?.status;

      if (status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        navigate("/login");
      } else if (status === 403) {
        alert("Você não tem permissão para editar este produto.");
      } else if (status === 404) {
        alert("Produto não encontrado / rota PUT não existe.");
      } else {
        alert("Erro ao atualizar produto.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.container}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Editar Produto</h2>
        <p>Atualize os dados mantendo a compatibilidade com o backend atual.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Nome"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="category">Categoria</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Selecione uma categoria</option>
              <option value="Roupas">Roupas</option>
              <option value="Perfumaria">Perfumaria</option>
              <option value="Calçados">Calçados</option>
              <option value="Praia">Praia</option>
              <option value="Outros">Outros</option>
              <option value="Atacado">Atacado</option>
              <option value="Kits">Kits</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            placeholder="Descrição"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="subcategory">Subcategoria</label>
            <select
              id="subcategory"
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
            >
              <option value="">Selecione uma subcategoria</option>
              {subcategoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="video_url">Vídeo</label>
            <input
              id="video_url"
              type="text"
              name="video_url"
              placeholder="URL ou nome do arquivo (ex: kitBaunilha.mp4)"
              value={form.video_url}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="price">Preço</label>
            <input
              id="price"
              type="text"
              name="price"
              inputMode="decimal"
              placeholder="Preço"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="stock">Estoque</label>
            <input
              id="stock"
              type="text"
              name="stock"
              inputMode="numeric"
              placeholder="Estoque"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.switches}>
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              name="is_wholesale"
              checked={form.is_wholesale}
              onChange={handleChange}
            />
            <span>Produto com preço atacado?</span>
          </label>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              name="is_kit"
              checked={form.is_kit}
              onChange={handleChange}
            />
            <span>Produto é um kit?</span>
          </label>
        </div>

        {form.is_wholesale && (
          <div className={styles.field}>
            <label htmlFor="wholesale_price">Preço atacado</label>
            <input
              id="wholesale_price"
              type="text"
              name="wholesale_price"
              inputMode="decimal"
              placeholder="Preço atacado"
              value={form.wholesale_price}
              onChange={handleChange}
            />
          </div>
        )}

        <div className={styles.sectionTitle}>
          <h4>Imagens</h4>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleAddImage}
          >
            + Adicionar imagem
          </button>
        </div>

        {form.images.map((img, index) => (
          <div key={index} className={styles.imageRow}>
            <input
              type="text"
              placeholder="URL da imagem ou nome do arquivo"
              value={img}
              onChange={(e) => handleImageChange(index, e.target.value)}
            />
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => handleRemoveImage(index)}
            >
              Remover
            </button>
          </div>
        ))}

        <div className={styles.sectionTitle}>
          <h4>Upload de vídeo</h4>
        </div>

        <input
          className={styles.fileInput}
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
        />

        <button type="submit" className={styles.submitButton} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}