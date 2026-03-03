import { useState } from "react";
import { updateProfile } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import styles from "./Profile.module.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function toAbsolutePhotoUrl(photo) {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  return `${API_BASE}${photo}`;
}

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(toAbsolutePhotoUrl(user?.photo));
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // preview local imediato
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);

      if (file) {
        formData.append("photo", file);
      }

      const response = await updateProfile(formData);

      // Backend retorna: { user: ... }
      const updated = response?.data?.user;

      // Garante URL absoluta para exibir sempre
      const finalUser = {
        ...updated,
        photo: toAbsolutePhotoUrl(updated?.photo),
      };

      // ✅ atualiza contexto + salva no localStorage
      updateUser(finalUser);

      // ✅ garante que a tela mostra a foto salva (não só a local)
      setPreview(finalUser.photo);

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Meu Perfil</h2>

        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {preview ? (
              <img src={preview} alt="Avatar" />
            ) : (
              (name?.charAt(0) || "U").toUpperCase()
            )}
          </div>

          <label className={styles.uploadBtn}>
            Alterar Foto
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div className={styles.formGroup}>
          <label>Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" value={user?.email || ""} disabled />
        </div>

        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </div>
  );
}