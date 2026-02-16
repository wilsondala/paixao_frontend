import { useEffect, useState } from "react";
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
    images: [],       // URLs de imagens
    video_url: "",    // URL do vídeo
  });

  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Buscar produto pelo ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setForm({
          name: res.data.name || "",
          description: res.data.description || "",
          price: res.data.price || "",
          stock: res.data.stock || "",
          images: res.data.images || [],
          video_url: res.data.video_url || "",
        });
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
        alert("Erro ao carregar produto. Verifique se o backend está rodando.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // 🔹 Atualiza campos simples
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Adicionar nova imagem
  const handleAddImage = () => setForm({ ...form, images: [...form.images, ""] });

  // 🔹 Atualiza imagem específica
  const handleImageChange = (index, value) => {
    const updated = [...form.images];
    updated[index] = value;
    setForm({ ...form, images: updated });
  };

  // 🔹 Remove imagem
  const handleRemoveImage = (index) => {
    const updated = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: updated });
  };

  // 🔹 Upload de vídeo local
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setVideoFile(file);
  };

  // 🔹 Submit (JSON ou FormData)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `/admin/products/${id}`;

      if (videoFile) {
        // FormData para enviar vídeo local
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", Number(form.price));
        formData.append("stock", Number(form.stock));
        formData.append("video", videoFile);

        // Adiciona URLs das imagens
        form.images.forEach((img, i) => formData.append(`images[${i}]`, img));

        await api.put(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // JSON para caso não haja vídeo local
        await api.put(url, {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          stock: Number(form.stock),
          images: form.images,
          video_url: form.video_url,
        });
      }

      alert("Produto atualizado com sucesso!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      alert("Erro ao atualizar produto. Verifique a URL do endpoint e se o backend permite CORS.");
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
          type="number"
          name="price"
          placeholder="Preço"
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

        <h4>Imagens</h4>
        {form.images.map((img, index) => (
          <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input
              type="text"
              placeholder="URL da imagem"
              value={img}
              onChange={(e) => handleImageChange(index, e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="button" onClick={() => handleRemoveImage(index)}>X</button>
          </div>
        ))}

        <button type="button" onClick={handleAddImage}>+ Adicionar imagem</button>

        <h4>Vídeo</h4>
        <input
          type="text"
          name="video_url"
          placeholder="URL do vídeo (opcional)"
          value={form.video_url}
          onChange={handleChange}
        />
        <input type="file" accept="video/*" onChange={handleVideoUpload} />

        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
}
