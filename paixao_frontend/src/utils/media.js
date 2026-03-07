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

  file = String(file).trim().replace(/\\/g, "/");

  if (!file) return "";

  // URL externa
  if (file.startsWith("http://") || file.startsWith("https://")) {
    return encodeURI(file);
  }

  // Já começa com /
  if (file.startsWith("/")) {
    return encodeURI(file);
  }

  // Já vem com pasta relativa
  if (file.startsWith("imagem/") || file.startsWith("video/") || file.startsWith("uploads/")) {
    return encodeURI(`/${file}`);
  }

  // Se por algum motivo vier com caminho maior contendo /imagem/ ou /video/
  if (file.includes("/imagem/")) {
    return encodeURI(file.slice(file.indexOf("/imagem/")));
  }

  if (file.includes("/video/")) {
    return encodeURI(file.slice(file.indexOf("/video/")));
  }

  if (file.includes("/uploads/")) {
    return encodeURI(file.slice(file.indexOf("/uploads/")));
  }

  // Detecta extensão do arquivo
  const ext = file.split(".").pop()?.toLowerCase();

  const videoExtensions = ["mp4", "webm", "ogg", "mov"];
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg", "bmp"];

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