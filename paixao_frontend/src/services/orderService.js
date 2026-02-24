import api from "../api/api";

export const getLatestOrders = async () => {
  const response = await api.get("/orders/latest");
  return response.data;
};