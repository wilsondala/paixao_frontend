import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import "./CreateProduct.css";

const CATEGORY_OPTIONS = {
  Roupas: ["Feminino", "Masculino", "Infantil", "Moda Praia"],
  Perfumaria: ["Óleo", "Hidratante", "Perfume", "Kit"],
  Calçados: ["Feminino", "Masculino", "Infantil"],
  Praia: ["Biquíni", "Saída de Praia", "Chinelo", "Acessórios"],
  Outros: ["Diversos"],
  Atacado: ["Lote", "Revenda"],
  Kits: ["Kit Promocional", "Kit Presente", "Kit Beleza"],
};

const INITIAL_FORM = {
  name: "",
  description: "",
  category: "Perfumaria",
  subcategory: "",
  price: "",
  stock: "",
  is_wholesale: false,
  wholesale_price: "",
  is_kit: false,
  images: [""],
  video_url: "",
};

function normalizePublicPath(filePath, type = "video") {
  if (!filePath) return "";

  let value = String(filePath).trim();
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) return value;

  value = value.replace(/\\/g, "/");

  const publicIndex = value.toLowerCase().indexOf("/public/");
  if (publicIndex !== -1) {
    value = value.slice(publicIndex + "/public".length);
    return value.startsWith("/") ? value : `/${value}`;
  }

  if (value.startsWith("/")) return value;

  if (type === "video") {
    if (value.startsWith("video/")) return `/${value}`;
    return `/video/${value}`;
  }

  if (type === "image") {
    if (value.startsWith("imagem/")) return `/${value}`;
    return `/imagem/produtos/${value}`;
  }

  return value;
}

export default function CreateProduct() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const subcategoryOptions = useMemo(() => {
    return CATEGORY_OPTIONS[form.category] || [];
  }, [form.category]);

  const previewVideoUrl = useMemo(() => {
    return normalizePublicPath(form.video_url, "video");
  }, [form.video_url]);

  useEffect(() => {
    if (!subcategoryOptions.length) return;

    const currentIsValid = subcategoryOptions.includes(form.subcategory);

    if (!currentIsValid) {
      setForm((prev) => ({
        ...prev,
        subcategory: "",
      }));
    }
  }, [form.category, subcategoryOptions, form.subcategory]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "category") {
        if (value === "Atacado") updated.is_wholesale = true;
        if (value === "Kits") updated.is_kit = true;
      }

      if (name === "is_wholesale" && !checked) {
        updated.wholesale_price = "";
      }

      return updated;
    });
  };

  const handleImageChange = (index, value) => {
    setForm((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = value;

      return {
        ...prev,
        images: updatedImages,
      };
    });
  };

  const addImageField = () => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const removeImageField = (index) => {
    setForm((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);

      return {
        ...prev,
        images: updatedImages.length ? updatedImages : [""],
      };
    });
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await api.post("/admin/products", {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        subcategory: form.subcategory.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        is_wholesale: form.is_wholesale,
        wholesale_price:
          form.is_wholesale && form.wholesale_price !== ""
            ? Number(form.wholesale_price)
            : null,
        is_kit: form.is_kit,
        images: form.images
          .map((img) => normalizePublicPath(img, "image"))
          .filter((img) => img.trim() !== ""),
        video_url: normalizePublicPath(form.video_url, "video"),
      });

      alert("Produto criado com sucesso!");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar produto");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-product-wrapper">
      <div className="create-product-card">
        <div className="create-product-header">
          <h2>Criar Produto</h2>
          <p>Cadastre produtos por categoria sem alterar a lógica atual do backend.</p>
        </div>

        <form onSubmit={handleSubmit} className="create-product-form">
          <div className="row-2">
            <div className="field-group">
              <label htmlFor="name">Nome do Produto</label>
              <input
                id="name"
                name="name"
                placeholder="Ex: Óleo Corporal Premium"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
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

          <div className="field-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              placeholder="Descreva o produto"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="row-2">
            <div className="field-group">
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

            <div className="field-group">
              <label htmlFor="stock">Estoque</label>
              <input
                id="stock"
                type="number"
                name="stock"
                placeholder="0"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
                step="1"
              />
            </div>
          </div>

          <div className="row-2">
            <div className="field-group">
              <label htmlFor="price">Preço normal</label>
              <input
                id="price"
                type="number"
                name="price"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="field-group">
              <label htmlFor="video_url">Vídeo do produto</label>
              <input
                id="video_url"
                name="video_url"
                placeholder="Ex: /video/kitAvela.mp4"
                value={form.video_url}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="switches-grid">
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="is_wholesale"
                checked={form.is_wholesale}
                onChange={handleChange}
              />
              <span>Produto com preço atacado?</span>
            </label>

            <label className="checkbox-row">
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
            <div className="field-group">
              <label htmlFor="wholesale_price">Preço atacado</label>
              <input
                id="wholesale_price"
                type="number"
                name="wholesale_price"
                placeholder="0.00"
                value={form.wholesale_price}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          )}

          <div className="video-box">
            <div className="video-box-header">
              <h4>Preview do vídeo</h4>
              <span className="helper-text">
                Exemplo correto: /video/kitAvela.mp4
              </span>
            </div>

            {form.video_url.trim() ? (
              <div className="video-preview">
                <video
                  key={previewVideoUrl}
                  controls
                  preload="metadata"
                  className="video-player"
                >
                  <source src={previewVideoUrl} type="video/mp4" />
                  Seu navegador não suporta vídeo.
                </video>

                <div className="video-preview-info">
                  <span><strong>Prévia:</strong> {previewVideoUrl}</span>
                </div>
              </div>
            ) : (
              <div className="video-empty">
                Informe um vídeo para visualizar aqui.
              </div>
            )}
          </div>

          <div className="section-divider" />

          <div className="images-header">
            <h4>Imagens</h4>
            <button type="button" className="add-btn" onClick={addImageField}>
              + Adicionar imagem
            </button>
          </div>

          {form.images.map((img, index) => (
            <div key={index} className="image-field">
              <input
                placeholder="Ex: /imagem/produtos/Baunilha.jpg"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
              />

              {form.images.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeImageField(index)}
                >
                  Remover
                </button>
              )}
            </div>
          ))}

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Criando produto..." : "Criar Produto"}
          </button>
        </form>
      </div>
    </div>
  );
}