// src/utils/media.js

export const formatMedia = (file) => {
  if (!file) return "";

  // URL externa
  if (file.startsWith("http")) return file;

  // Já começa com /
  if (file.startsWith("/")) return file;

  // Já contém o caminho correto
  if (file.startsWith("imagem/produtos"))
    return `/${file}`;

  // Apenas nome do arquivo
  return `/imagem/produtos/${file}`;
};