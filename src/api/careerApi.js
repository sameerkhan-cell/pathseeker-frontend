import api from "./client";
import axios from "axios";

// Plain axios instance for no-auth public endpoints — does NOT attach the JWT.
const publicClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
});

export const careerApi = {
  // ── Auth-required (logged-in users) ─────────────────────────────────────
  getCareers: (filters = {}) => api.get("/careers", { params: filters }),
  getCareerById: (id) => api.get(`/careers/${id}`),
  saveFilter: (name, filterConfig) => api.post("/careers/saved-filters", { name, filterConfig }),
  getSavedFilters: () => api.get("/careers/saved-filters"),
  deleteSavedFilter: (id) => api.delete(`/careers/saved-filters/${id}`),

  // ── Public (no auth required) ────────────────────────────────────────────
  // Uses a plain axios instance so no Authorization header is attached.
  getTrendingCareers: () =>
    publicClient.get("/careers/trending").then((res) => res.data),

  // ── Admin ────────────────────────────────────────────────────────────────
  adminListCareers: (filters = {}) => api.get("/admin/careers", { params: filters }),
  createCareer: (payload) => api.post("/admin/careers", payload),
  updateCareer: (id, payload) => api.put(`/admin/careers/${id}`, payload),
  deleteCareer: (id) => api.delete(`/admin/careers/${id}`),
  restoreCareer: (id) => api.post(`/admin/careers/${id}/restore`),
};

