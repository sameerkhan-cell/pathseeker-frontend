import api from "./client";

export const adminApi = {
  getOverviewStats: () => api.get("/admin/stats/overview"),
};
