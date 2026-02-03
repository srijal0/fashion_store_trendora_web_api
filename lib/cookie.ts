// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use server";
// import { cookies } from "next/headers";
// export const setAuthToken = async (token: string) => {
//     const cookieStore = await cookies();
//     cookieStore.set({name: "auth_token", value: token});
// }
// export const getAuthToken = async () => {
//     const cookieStore = await cookies();
//     return cookieStore.get("auth_token")?.value || null;
// }
// export const setUserData = async (userData: any ) => {
//     const cookieStore = await cookies();
//     // cookie can only store string values
//     cookieStore.set({name: "user_data", value: JSON.stringify(userData)});
// }
// export const getUserData = async () => {
//     const cookieStore = await cookies();
//     const data = cookieStore.get("user_data")?.value || null;
//     return data ? JSON.parse(data) : null;
// }
// export const clearAuthCookies = async () => {
//     const cookieStore = await cookies();
//     cookieStore.delete("auth_token");
//     cookieStore.delete("user_data");
// }
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { cookies } from "next/headers";

export const setAuthToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth_token",
    value: token,
    httpOnly: false,   // ✅ ADDED: lets browser JS read the cookie
    path: "/",         // ✅ ADDED: cookie available on all routes
    sameSite: "lax",   // ✅ ADDED: basic CSRF protection
  });
}

export const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value || null;
}

export const setUserData = async (userData: any) => {
  const cookieStore = await cookies();
  cookieStore.set({ name: "user_data", value: JSON.stringify(userData) });
}

export const getUserData = async () => {
  const cookieStore = await cookies();
  const data = cookieStore.get("user_data")?.value || null;
  return data ? JSON.parse(data) : null;
}

export const clearAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("user_data");
}