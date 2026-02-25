import api from "../api/api";

export const getLatestOrders = async () => {
  const response = await api.get("/orders/latest");
  return response.data;
};

export const createOrder = async (data) => {
  const response = await api.post("/orders", data);
  return response.data;
};