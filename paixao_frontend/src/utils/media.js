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
      console.warn("Erro ao converter JSON de imagem:", err);
    }
  }

  file = String(file).trim();

  if (!file) return "";

  // URL externa (http ou https)
  if (file.startsWith("http://") || file.startsWith("https://")) {
    return file;
  }

  // Já começa com /
  if (file.startsWith("/")) {
    return file;
  }

  // Já contém pasta correta
  if (file.startsWith("imagem/produtos") || file.startsWith("images/produtos")) {
    return `/${file}`;
  }

  // Apenas nome do arquivo
  // ⚠️ AJUSTE AQUI SE SUA PASTA FOR DIFERENTE
  return `/imagem/produtos/${file}`;
};