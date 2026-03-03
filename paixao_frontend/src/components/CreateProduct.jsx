import { useState } from "react";
import api from "../api/api";
import "./CreateProduct.css";

export default function CreateProduct() {
  const [form, setForm] = useState({
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
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (index, value) => {
    const updated = [...form.images];
    updated[index] = value;
    setForm({ ...form, images: updated });
  };

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ""] });
  };

  const removeImageField = (index) => {
    const updated = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: updated.length ? updated : [""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/products", {
        name: form.name,
        description: form.description,
        category: form.category,
        subcategory: form.subcategory,
        price: Number(form.price),
        stock: Number(form.stock),
        is_wholesale: form.is_wholesale,
        wholesale_price: form.is_wholesale
          ? Number(form.wholesale_price)
          : null,
        is_kit: form.is_kit,
        images: form.images.filter((img) => img.trim() !== ""),
        video_url: form.video_url.trim(),
      });

      alert("Produto criado com sucesso!");

      setForm({
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
            placeholder="Descrição"
            value={form.description}
            onChange={handleChange}
          />

          <select
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

          <input
            name="subcategory"
            placeholder="Subcategoria (Ex: Óleo, Hidratante, Kit...)"
            value={form.subcategory}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Preço normal"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Estoque"
            value={form.stock}
            onChange={handleChange}
            required
          />

          {/* WHOLESALE */}
          <label className="checkbox-row">
            <input
              type="checkbox"
              name="is_wholesale"
              checked={form.is_wholesale}
              onChange={handleChange}
            />
            Produto com preço atacado?
          </label>

          {form.is_wholesale && (
            <input
              type="number"
              name="wholesale_price"
              placeholder="Preço atacado"
              value={form.wholesale_price}
              onChange={handleChange}
            />
          )}

          {/* KIT */}
          <label className="checkbox-row">
            <input
              type="checkbox"
              name="is_kit"
              checked={form.is_kit}
              onChange={handleChange}
            />
            Produto é um kit?
          </label>

          <h4>Imagens</h4>

          {form.images.map((img, index) => (
            <div key={index} className="image-field">
              <input
                placeholder="URL ou nome da imagem"
                value={img}
                onChange={(e) =>
                  handleImageChange(index, e.target.value)
                }
              />

              {form.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                >
                  Remover
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addImageField}>
            + Adicionar imagem
          </button>

          <input
            name="video_url"
            placeholder="URL do vídeo"
            value={form.video_url}
            onChange={handleChange}
          />

          <button type="submit">
            Criar Produto
          </button>

        </form>
      </div>
    </div>
  );
}