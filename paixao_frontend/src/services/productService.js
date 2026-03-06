import api from "../api/api";

export function getProducts(params = {}) {
  return api.get("/products", { params });
}

export function getProductById(id) {
  return api.get(`/products/${id}`);
}


