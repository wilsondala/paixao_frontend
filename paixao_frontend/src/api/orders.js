import api from "./client";
import axios from "axios";

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
export async function createOrder(orderData) {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/orders",
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("ERRO COMPLETO:", error.response?.data);
    throw error;
  }
}
export async function updateItemStatus(itemId, status) {
  const response = await api.put(
    `/orders/items/${itemId}/status`,
    { status }
  );

  return response.data;
}

