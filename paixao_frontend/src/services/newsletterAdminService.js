import api from "../api/api";

export async function getNewsletterStats() {
  const { data } = await api.get("/admin/newsletter/stats");
  return data;
}

export async function listNewsletterSubscribers({ q = "", limit = 100, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("limit", String(limit));
  params.set("offset", String(offset));

  const { data } = await api.get(`/admin/newsletter/subscribers?${params.toString()}`);
  return data;
}

export function exportNewsletterCsvUrl() {
  // usa o mesmo baseURL do axios + token via header não funciona no download direto,
  // então vamos baixar via fetch com Authorization (na página).
  return "/admin/newsletter/export.csv";
}