import api from "./client";

export const mediaApi = {
  getMedia: (filters = {}) => api.get("/media", { params: filters }),
  getMediaById: (id) => api.get(`/media/${id}`),
  rateMedia: (id, rating) => api.post(`/media/${id}/rating`, { rating }),
  getRatingSummary: (id) => api.get(`/media/${id}/rating-summary`),

  adminCreateMedia: (payload) => api.post("/admin/media", payload),
  adminUpdateMedia: (id, payload) => api.put(`/admin/media/${id}`, payload),
  adminDeleteMedia: (id) => api.delete(`/admin/media/${id}`),
};
