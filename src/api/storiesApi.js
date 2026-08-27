import api from "./client";

export const storiesApi = {
  submitStory: (payload) => api.post("/stories", payload),
  getMyStories: () => api.get("/stories/mine"),
  getStories: (filters = {}) => api.get("/stories", { params: filters }),
  getStoryById: (id) => api.get(`/stories/${id}`),

  adminListStories: (filters = {}) => api.get("/admin/stories", { params: filters }),
  adminApproveStory: (id) => api.put(`/admin/stories/${id}/approve`),
  adminRejectStory: (id, reason) => api.put(`/admin/stories/${id}/reject`, { reason }),
};
