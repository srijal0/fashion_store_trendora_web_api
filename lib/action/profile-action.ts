"use server";

import { ProfileUpdateResponse } from "@/app/user/profile/schema";

/**
 * Update user profile with image upload
 * This function sends FormData to the backend API (Multer support)
 * Endpoint: PUT /api/auth/:id
 */
export async function handleUpdateProfile(
  userId: string,
  formData: FormData
): Promise<ProfileUpdateResponse> {
  try {
    // Get the backend API URL from environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Make PUT request to backend with FormData
    const response = await fetch(`${apiUrl}/api/auth/${userId}`, {
      method: "PUT",
      body: formData, // Send as FormData (Multer requirement)
      credentials: "include", // Include cookies for authentication
      // NOTE: Don't set Content-Type header - browser will set it automatically with boundary
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to update profile",
      };
    }

    return {
      success: true,
      message: data.message || "Profile updated successfully",
      data: data.data || data.user,
    };
  } catch (error: any) {
    console.error("Profile update error:", error);
    return {
      success: false,
      message: error.message || "An error occurred while updating profile",
    };
  }
}

/**
 * Get current user profile
 * Endpoint: GET /api/auth/profile or GET /api/auth/:id
 */
export async function getCurrentUserProfile(
  userId: string
): Promise<ProfileUpdateResponse> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const response = await fetch(`${apiUrl}/api/auth/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Don't cache user data
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch profile",
      };
    }

    return {
      success: true,
      data: data.data || data.user,
    };
  } catch (error: any) {
    console.error("Fetch profile error:", error);
    return {
      success: false,
      message: error.message || "An error occurred while fetching profile",
    };
  }
}