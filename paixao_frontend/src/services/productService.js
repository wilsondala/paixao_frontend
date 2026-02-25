import api from "../api/api";

export async function getProducts() {
  return await api.get("/products");
}
export async function getProductById(id) {
  return await api.get(`/products/${id}`);
}