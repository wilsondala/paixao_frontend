import api from "./client";

/**
 * ORDERS API (centralizado)
 * Mantém exports usados no projeto:
 * - OrderDetails.jsx: getOrderById, confirmOrder, updateItemStatus
 * - Checkout.jsx: createOrder
 * - OrderList.jsx: getOrders
 * - SocialProof.jsx: getLatestOrders
 */

// Lista pedidos (ajuste se seu backend usa outro path)
export const getOrders = () => api.get("/orders");

// Criar pedido (Checkout)
export const createOrder = (data) => api.post("/orders", data);

// Buscar pedido por ID (OrderDetails)
export const getOrderById = (id) => api.get(`/orders/${id}`);

// Confirmar pedido (admin ou fluxo do pedido)
// ⚠️ Se seu backend não tiver /confirm, ajuste aqui para o endpoint real.
export const confirmOrder = (id) => api.put(`/orders/${id}/confirm`);

// Atualizar status de item do pedido (OrderDetails)
// ⚠️ Endpoint pode variar no seu backend. Se der 404, me diga qual rota existe no backend.
export const updateItemStatus = (orderId, itemId, status) =>
  api.put(`/orders/${orderId}/items/${itemId}/status`, { status });

// SocialProof: últimas compras
export const getLatestOrders = () => api.get("/orders/latest");

// (Opcional) marcar entregue — se você usar em algum lugar
export const deliverOrder = (id) => api.put(`/orders/${id}/deliver`);

// (Opcional) escolher entrega — se você usar em algum lugar
export const chooseDelivery = (id, delivery_method) =>
  api.put(`/orders/${id}/delivery`, { delivery_method });