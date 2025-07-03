// helpers/api/config.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3025/",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để luôn lấy token mới nhất
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      config.headers['Authorization'] = `Bearer ${storedToken}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
