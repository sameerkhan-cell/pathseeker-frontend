import api from "./client";

export const resourceApi = {
  getResources: (filters = {}) => api.get("/resources", { params: filters }),
  getResourceById: (id) => api.get(`/resources/${id}`),
  downloadResource: (id) => api.post(`/resources/${id}/download`),

  adminCreateResource: (formData) => {
    // FormData: let the browser set multipart boundaries
    return api.post("/admin/resources", formData);
  },
  adminUpdateResource: (id, formData) => api.put(`/admin/resources/${id}`, formData),
  adminDeleteResource: (id) => api.delete(`/admin/resources/${id}`),
};
