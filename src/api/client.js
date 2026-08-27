import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("pathseeker_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor -> unwraps data, normalizes errors
apiClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const normalized = new Error(
      err.response?.data?.message || err.message || "Request failed"
    );
    normalized.status = err.response?.status;
    normalized.data = err.response?.data;
    return Promise.reject(normalized);
  }
);

export default apiClient;
