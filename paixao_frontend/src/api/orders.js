import api from "./client";

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
