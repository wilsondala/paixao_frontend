// src/api/orders.js  (ou onde estiver)
import api from "./client";  // ← mantenha isso, é o seu axios configurado

export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const confirmOrder = async (id) => {
  await api.post(`/orders/${id}/confirm`);
};

export const deliverOrder = async (id) => {
  await api.post(`/orders/${id}/delivery`, { payment_method: "entrega" });
};

export async function getOrderById(id) {
  const response = await api.get(`/orders/${id}`);
  return response.data;
}

// 🔥 Corrigido: usa o mesmo 'api' (com baseURL e token automático)
export async function createOrder(orderData) {
  try {
    const response = await api.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("ERRO AO CRIAR PEDIDO:", error.response?.data || error.message);
    throw error;  // mantém o throw para o catch no Checkout pegar
  }
}

export async function updateItemStatus(itemId, status) {
  const response = await api.put(
    `/orders/items/${itemId}/status`,
    { status }
  );
  return response.data;
}