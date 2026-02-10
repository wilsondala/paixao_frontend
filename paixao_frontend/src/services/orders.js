import api from "../api/client";

export const confirmOrder = (id) =>
  api.post(`/orders/${id}/confirm`);

export const chooseDelivery = (id, paymentMethod) =>
  api.post(`/orders/${id}/delivery`, {
    payment_method: paymentMethod,
  });
