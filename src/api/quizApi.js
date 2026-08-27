import api from "./client";

export const quizApi = {
  getActiveQuizzes: () => api.get("/quiz/active"),
  startQuiz: (id) => api.get(`/quiz/${id}/start`),
  submitQuiz: (id, payload) => api.post(`/quiz/${id}/submit`, payload),
  getHistory: () => api.get("/quiz/history"),
  getAttempt: (attemptId) => api.get(`/quiz/attempts/${attemptId}`),

  // Admin
  adminCreateQuiz: (payload) => api.post("/admin/quiz", payload),
  adminUpdateQuiz: (id, payload) => api.put(`/admin/quiz/${id}`, payload),
  adminAddQuestion: (quizId, payload) => api.post(`/admin/quiz/${quizId}/questions`, payload),
  adminListQuestions: (quizId) => api.get(`/admin/quiz/${quizId}/questions`),
  adminUpdateQuestion: (questionId, payload) => api.put(`/admin/quiz/questions/${questionId}`, payload),
  adminDeleteQuestion: (questionId) => api.delete(`/admin/quiz/questions/${questionId}`),
};
