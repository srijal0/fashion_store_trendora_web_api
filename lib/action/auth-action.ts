//  /* eslint-disable @typescript-eslint/no-explicit-any */
// // // note: server side processing

// "use server";


// import { login, register } from "../api/auth";
// import { setAuthToken, setUserData } from "../cookie";


// export const handleRegister = async (formData: any) => {
//   try {
//     // info: how data sent from component to backend api
//     const res = await register(formData);
//     // component return logic
//     if(res.success) {
//       return {
//         success: true,
//         data: res.data,
//         message: "Registration successful"
//       };
//     }
//     return {success: false, message: res.message || "Registration failed"};
//   } catch (error: Error | any ) {
//     // console.log("Auth action ko error bitra aayo");

//     return {success: false, message: error.message || "Registration failed"};
//   }
// }

// export const handleLogin = async (formData: any) => {
//   try {
//     // info: how data sent from component to backend api
//     const res = await login(formData);
//     // component return logic
//     if(res.success) {
//       const token = res.token;
//       await setAuthToken(token);
//       await setUserData(res.data);
//       return {
//         success: true,
//         data: res.data,
//         message: "Login successful"
//       };
//     }
//     return {success: false, message: res.message || "Login failed"};
//   } catch (error: Error | any ) {
//     return {success: false, message: error.message || "Login failed"};
//   }
// }

// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // // note: server side processing


/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { login, register } from "../api/auth";
import { setAuthToken, setUserData } from "../cookie";

export type AuthResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  user?: {
    id: string;
    email: string;
    name?: string;
    role: "admin" | "user";
  };
};

// ===== HANDLE REGISTER =====
export const handleRegister = async (formData: any): Promise<AuthResponse> => {
  try {
    const res = await register(formData);
    if (res.success) {
      return {
        success: true,
        data: res.data,
        message: "Registration successful",
      };
    }
    return { success: false, message: res.message || "Registration failed" };
  } catch (error: Error | any) {
    console.error("Register error:", error);
    return { success: false, message: error.message || "Registration failed" };
  }
};

// ===== HANDLE LOGIN =====
export const handleLogin = async (formData: any): Promise<AuthResponse> => {
  try {
    const res = await login(formData);

    console.log("Backend login response:", res); // Debug log

    if (res.success) {
      const token = res.token;

      // ✅ store JWT token in cookie with unified name
      await setAuthToken(token);

      // store user data in cookie
      await setUserData(res.data);

      // ✅ Return user data with role for redirect logic
      return {
        success: true,
        data: res.data,
        message: "Login successful",
        user: {
          id: res.data?.id || res.data?._id,
          email: res.data?.email,
          name: res.data?.name,
          role: res.data?.role || "user",
        },
      };
    }
    return { success: false, message: res.message || "Login failed" };
  } catch (error: Error | any) {
    console.error("Login error:", error);
    return { success: false, message: error.message || "Login failed" };
  }
};
