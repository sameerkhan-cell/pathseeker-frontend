import api from "./client";

export const profileApi = {
  getMyProfile: () => api.get("/profile/me"),
  updateProfile: (data) => api.put("/profile/me", data),
  uploadResume: (file) => {
    const fd = new FormData();
    fd.append("resume", file);
    // No manual Content-Type: browser must set multipart boundary itself
    return api.post("/profile/resume", fd);
  },
  deleteResume: () => api.delete("/profile/resume"),
};
