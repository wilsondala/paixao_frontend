// src/utils/media.js

export const formatMedia = (file) => {
  if (!file) return "";

  // Se vier array, pega o primeiro item
  if (Array.isArray(file)) {
    file = file[0];
  }

  // Se vier como string JSON (ex: '["https://..."]')
  if (typeof file === "string" && file.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(file);
      if (Array.isArray(parsed) && parsed.length > 0) {
        file = parsed[0];
      }
    } catch (err) {
      console.warn("Erro ao converter JSON de mídia:", err);
    }
  }

  file = String(file).trim();

  if (!file) return "";

  // URL externa
  if (file.startsWith("http://") || file.startsWith("https://")) {
    return encodeURI(file);
  }

  // Já começa com /
  if (file.startsWith("/")) {
    return encodeURI(file);
  }

  // Detecta extensão do arquivo
  const ext = file.split(".").pop()?.toLowerCase();

  const videoExtensions = ["mp4", "webm", "ogg"];
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

  // 🎥 Vídeo
  if (videoExtensions.includes(ext)) {
    return encodeURI(`/video/${file}`);
  }

  // 🖼️ Imagem
  if (imageExtensions.includes(ext)) {
    return encodeURI(`/imagem/produtos/${file}`);
  }

  // fallback
  return encodeURI(`/${file}`);
};