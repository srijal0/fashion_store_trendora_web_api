import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Helper function to get token from cookie
const getTokenFromCookie = (): string | null => {
  if (typeof window === "undefined") return null;
  
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "auth_token") {
      return value;
    }
  }
  return null;
};

axiosInstance.interceptors.request.use((config) => {
  const token = getTokenFromCookie();
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // ✅ Log every request
  console.log("📤 Axios Request:", {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`,
    data: config.data,
  });
  
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // ✅ Log successful responses
    console.log("✅ Axios Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    // ✅ More detailed error logging
    console.error("❌ Axios Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : "unknown",
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;