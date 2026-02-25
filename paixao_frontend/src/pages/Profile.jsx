import { useState } from "react";
import { updateProfile } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.photo || null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
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

      // Atualiza usuário global
      setUser(response.data.user);

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
              name?.charAt(0)?.toUpperCase()
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