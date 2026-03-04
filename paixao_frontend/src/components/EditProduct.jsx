import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import styles from "./EditProduct.module.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
    video_url: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Como o axios baseURL deve ser .../api/v1,
  // aqui a gente usa apenas o path da rota.
  const fetchUrl = useMemo(() => `/products/${id}`, [id]);

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
          images: Array.isArray(res.data?.images) ? res.data.images : [],
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const handleImageChange = (index, value) => {
    setForm((prev) => {
      const updated = [...prev.images];
      updated[index] = value;
      return { ...prev, images: updated };
    });
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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

  // ✅ normaliza video_url:
  // - "kitBaunilha.mp4" -> "/video/kitBaunilha.mp4"
  // - "/video/kitBaunilha.mp4" -> mantém
  // - "https://..." -> mantém
  const normalizeVideoUrl = (raw) => {
    const v = String(raw || "").trim();
    if (!v) return null;

    if (v.startsWith("http://") || v.startsWith("https://")) return v;
    if (v.startsWith("/")) return v;
    return `/video/${v}`;
  };

  // ✅ Sem fallback pra rota pública em UPDATE:
  // edição é ação de ADMIN, então faz sentido usar só /admin.
  // (o fallback escondia problema de rota e gera confusão)
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
        images: normalizeImages(form.images),
        video_url: normalizeVideoUrl(form.video_url),
      };

      const urlAdmin = `/products/${id}`;

      // ✅ Só usa multipart se realmente tiver arquivo de vídeo
      if (videoFile) {
        const formData = new FormData();
        formData.append("name", payloadBase.name);
        formData.append("description", payloadBase.description);
        formData.append("price", String(payloadBase.price));
        formData.append("stock", String(payloadBase.stock));
        if (payloadBase.category) formData.append("category", payloadBase.category);
        if (payloadBase.video_url) formData.append("video_url", payloadBase.video_url);

        // backend precisa aceitar "video" como UploadFile
        formData.append("video", videoFile);

        // imagens continuam como strings
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

  if (loading) return <div className={styles.container}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <h2>Editar Produto</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="price"
          inputMode="decimal"
          placeholder="Preço"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="stock"
          inputMode="numeric"
          placeholder="Estoque"
          value={form.stock}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Categoria (ex: Perfumaria, Roupas...)"
          value={form.category}
          onChange={handleChange}
        />

        <h4>Imagens</h4>

        {form.images.map((img, index) => (
          <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="URL da imagem ou nome do arquivo"
              value={img}
              onChange={(e) => handleImageChange(index, e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="button" onClick={() => handleRemoveImage(index)}>
              X
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddImage}>
          + Adicionar imagem
        </button>

        <h4>Vídeo</h4>

        <input
          type="text"
          name="video_url"
          placeholder="Vídeo: URL ou nome do arquivo (ex: kitBaunilha.mp4)"
          value={form.video_url}
          onChange={handleChange}
        />

        <input type="file" accept="video/*" onChange={handleVideoUpload} />

        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}