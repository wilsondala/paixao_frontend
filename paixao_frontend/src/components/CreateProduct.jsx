import { useState } from "react";
import api from "../api/api";
import "./CreateProduct.css";

export default function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [""], // começa com 1 campo
    video_url: "",
  });

  // Atualiza campos simples
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Atualiza imagem específica
  const handleImageChange = (index, value) => {
    const updatedImages = [...form.images];
    updatedImages[index] = value;
    setForm({ ...form, images: updatedImages });
  };

  // Adicionar novo campo de imagem
  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/products", {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images.filter((img) => img !== ""),
        video_url: form.video_url,
      });

      alert("Produto criado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar produto");
    }
  };

  return (
    <div className="create-product-container">
      <h2>Criar Produto</h2>

      <form onSubmit={handleSubmit} className="create-product-form">
        <input
          name="name"
          placeholder="Nome"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Descrição"
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          placeholder="Preço"
          onChange={handleChange}
          required
        />

        <input
          name="stock"
          type="number"
          placeholder="Estoque"
          onChange={handleChange}
          required
        />

        <h4>Imagens</h4>

        {form.images.map((img, index) => (
          <input
            key={index}
            placeholder="URL da imagem"
            value={img}
            onChange={(e) =>
              handleImageChange(index, e.target.value)
            }
          />
        ))}

        <button type="button" onClick={addImageField}>
          + Adicionar imagem
        </button>

        <input
          name="video_url"
          placeholder="URL do vídeo"
          onChange={handleChange}
        />

        <button type="submit">Criar Produto</button>
      </form>
    </div>
  );
}
