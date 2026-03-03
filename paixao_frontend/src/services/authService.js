import api from "../api/client";

// LOGIN
export const loginUser = (formData) =>
  api.post("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

// REGISTER
export const registerUser = (data) => api.post("/auth/register", data);

// UPDATE PROFILE (multipart/form-data)
export const updateProfile = (formData) =>
  api.put("/auth/update-profile", formData);

// GET USER LOGADO (se você ainda não criou no backend, não use por enquanto)
export const getMe = () => api.get("/auth/me");