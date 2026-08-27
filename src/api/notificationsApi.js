import api from "./client";

export const notificationsApi = {
  list: (page = 1, limit = 20) => api.get("/notifications", { params: { page, limit } }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/read-all"),
  unreadCount: () => api.get("/notifications/unread-count"),
};
