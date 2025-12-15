import axios from "axios";
import { authStorage } from "../features/auth/authStorage";
import { endpoints } from "./endpoints";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ====== AUTO REFRESH TOKEN ======
let isRefreshing = false;
let queue = [];

function processQueue(error, token = null) {
  queue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  queue = [];
}

apiClient.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;
    const url = original?.url || "";

    // ✅ BỎ QUA auto-refresh cho các endpoint auth
    const isAuthEndpoint =
      url.includes(endpoints.auth.login) ||
      url.includes(endpoints.auth.register) ||
      url.includes(endpoints.auth.refresh);

    // nếu accessToken hết hạn (và KHÔNG phải call login/register/refresh)
    if (status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;

      if (isRefreshing) {
        // đợi refresh xong rồi retry
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return apiClient(original);
        });
      }

      isRefreshing = true;

      try {
        const data = await apiClient.post(endpoints.auth.refresh);

        // vì success interceptor trả res.data -> data đã là object phẳng
        const newAccessToken = data?.accessToken || data?.token;

        if (!newAccessToken) throw new Error("Refresh không trả accessToken");

        authStorage.set(newAccessToken);
        processQueue(null, newAccessToken);

        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        authStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    const backendError = error?.response?.data?.error;
    const message =
      backendError?.message ||
      error?.response?.data?.message ||
      error.message;

    return Promise.reject({ status, message, raw: error, backendError });
  }
);

export default apiClient;
