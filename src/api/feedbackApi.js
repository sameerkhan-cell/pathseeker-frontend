import api from "./client";

export const feedbackApi = {
  submit: (type, message) => api.post("/feedback", { type, message }),
  mine: () => api.get("/feedback/mine"),

  adminList: (filters = {}) => api.get("/admin/feedback", { params: filters }),
  adminStats: () => api.get("/admin/feedback/stats"),
  adminRespond: (id, response) => api.put(`/admin/feedback/${id}/respond`, { response }),
  adminSetStatus: (id, status) => api.put(`/admin/feedback/${id}/status`, { status }),
};
