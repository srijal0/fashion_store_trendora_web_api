/* eslint-disable @typescript-eslint/no-explicit-any */
// Note: Actual backend API calls
import axios from "./axios";
import { API } from "./endpoint";

/* ================= REGISTER ================= */
export const register = async (registerData: any) => {
  try {
    const response = await axios.post(API.AUTH.REGISTER, registerData);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Registration Failed"
    );
  }
};

/* ================= LOGIN ================= */
export const login = async (loginData: any) => {
  try {
    const response = await axios.post(API.AUTH.LOGIN, loginData);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Login Failed"
    );
  }
};

/* ================= GET CURRENT USER ================= */
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(API.AUTH.ME);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user"
    );
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(API.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to send reset email"
    );
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const url = `${API.AUTH.RESET_PASSWORD}/${token}`;
    console.log("🔍 Making reset password request:");
    console.log("  URL:", url);
    console.log("  Body:", { newPassword: "***hidden***" });
    
    const response = await axios.post(
      url,
      { newPassword }
    );
    
    console.log("✅ Reset password response:", response.data);
    return response.data;
  } catch (error: Error | any) {
    console.error("❌ Reset password error:");
    console.error("  Status:", error.response?.status);
    console.error("  Data:", error.response?.data);
    console.error("  Message:", error.message);
    
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to reset password"
    );
  }
};