import api from "./client";

export const getOrders = async () => {
  const response = await api.get("/orders/me");
  return response.data;
};
