import { useState } from "react";
import api from "../api/api";
import "./CreateProduct.css";

export default function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [""],
    video_url: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...form.images];
    updatedImages[index] = value;
    setForm({ ...form, images: updatedImages });
  };

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ""] });
  };

  const removeImageField = (index) => {
    const updatedImages = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/products", {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images.filter((img) => img.trim() !== ""),
        video_url: form.video_url.trim(),
      });

      alert("Produto criado com sucesso!");

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        images: [""],
        video_url: "",
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao criar produto");
    }
  };

  return (
    <div className="create-product-wrapper">
      <div className="create-product-card">
        <h2>Criar Produto</h2>

        <form onSubmit={handleSubmit} className="create-product-form">
          <input
            name="name"
            placeholder="Nome do Produto"
            value={form.name}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Descrição do Produto"
            value={form.description}
            onChange={handleChange}
          />

          <input
            name="price"
            type="number"
            placeholder="Preço"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            name="stock"
            type="number"
            placeholder="Estoque"
            value={form.stock}
            onChange={handleChange}
            required
          />

          <h4>Imagens</h4>

          {form.images.map((img, index) => (
            <div key={index} className="image-field">
              <input
                placeholder="https://site.com/imagem.jpg ou nome.jpg"
                value={img}
                onChange={(e) =>
                  handleImageChange(index, e.target.value)
                }
              />

              {img && (
                <img
                  src={
                    img.startsWith("http")
                      ? img
                      : `/images/produtos/${img}`
                  }
                  alt="preview"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}

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

          <button type="button" onClick={addImageField} className="add-btn">
            + Adicionar imagem
          </button>

          <input
            name="video_url"
            placeholder="URL do vídeo"
            value={form.video_url}
            onChange={handleChange}
          />

          <button type="submit" className="submit-btn">
            Criar Produto
          </button>
        </form>
      </div>
    </div>
  );
}