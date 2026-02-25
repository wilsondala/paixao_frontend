import api from "../api/client";

// LOGIN
export const loginUser = (formData) =>
  api.post("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

// REGISTER
export const registerUser = (data) =>
  api.post("/auth/register", data);

// UPDATE PROFILE
export const updateProfile = (formData) =>
  api.put("/auth/update-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// GET USER LOGADO
export const getMe = () =>
  api.get("/auth/me");