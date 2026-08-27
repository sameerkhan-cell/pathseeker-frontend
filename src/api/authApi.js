import api from "./client";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  verifyEmail: (payload) => api.post("/auth/verify-email", payload),
  login: (payload) => api.post("/auth/login", payload),
  adminLogin: (payload) => api.post("/auth/admin/login", payload),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
  me: () => api.get("/auth/me"),
};
