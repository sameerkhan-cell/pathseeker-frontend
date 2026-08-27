import api from "./client";

export const bookmarksApi = {
  create: (itemType, itemId) => api.post("/bookmarks", { itemType, itemId }),
  list: (filters = {}) => api.get("/bookmarks", { params: filters }),
  remove: (id) => api.delete(`/bookmarks/${id}`),
  addNote: (bookmarkId, noteText) => api.post(`/bookmarks/${bookmarkId}/notes`, { noteText }),
  updateNote: (noteId, noteText) => api.put(`/bookmarks/notes/${noteId}`, { noteText }),
  deleteNote: (noteId) => api.delete(`/bookmarks/notes/${noteId}`),
  getShareLink: () => api.get("/bookmarks/share"),
};
