// import axios from "axios";
// import { getAuthToken } from "../cookie";

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Update request interceptor to use cookies instead of localStorage
// axiosInstance.interceptors.request.use(async (config) => {
//   try {
//     // Get token from cookies (server-side safe)
//     const token = await getAuthToken();
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   } catch (error) {
//     // If we're on client-side and can't use server action, try to get from cookie directly
//     if (typeof document !== "undefined") {
//       const cookies = document.cookie.split(';');
//       const authCookie = cookies.find(c => c.trim().startsWith('auth_token='));
//       if (authCookie) {
//         const token = authCookie.split('=')[1];
//         if (token && config.headers) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//       }
//     }
//   }
//   return config;
// });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

// import axios from "axios";

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


// lib/api/axios.ts
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ ADD THIS - Sends cookies with requests
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
  
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;