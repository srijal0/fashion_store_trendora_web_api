/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, ChangeEvent } from "react";
import { ProfileData, profileSchema } from "../schema";

interface ProfileFormProps {
  userId: string;
  initialData?: {
    name?: string;
    email?: string;
    bio?: string;
    phone?: string;
    image?: string;
  };
}

// Reads auth_token from document.cookie (client-side only)
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("auth_token="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

// Inline fallback avatar — no external dependency, always works
function FallbackAvatar({ name }: { name: string }) {
  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="w-full h-full rounded-full bg-pink-200 flex items-center justify-center">
      <span className="text-pink-600 font-bold text-2xl select-none">
        {initials}
      </span>
    </div>
  );
}

export default function ProfileForm({ userId, initialData }: ProfileFormProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getProxiedImageUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    if (url.startsWith("data:")) return url;
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    }
    if (url.startsWith("/uploads")) {
      return url;
    }
    return url;
  };

  const [imagePreview, setImagePreview] = useState<string | null>(
    getProxiedImageUrl(initialData?.image)
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      bio: initialData?.bio || "",
      phone: initialData?.phone || "",
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (JPG, PNG, GIF, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setImageRemoved(false);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setImageRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: ProfileData) => {
    setError("");
    setSuccess("");

    try {
      // Get the auth token from cookie — needed for Express isAuthenticated middleware
      const token = getTokenFromCookie();
      if (!token) {
        setError("Session expired. Please log in again.");
        return;
      }

      // Step 1: If a new image was selected, upload it to Next.js first
      // Next.js /api/profile/update saves the file to public/uploads
      let uploadedImageUrl: string | null = null;

      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("userId", userId);
        uploadFormData.append("name", data.name);
        uploadFormData.append("email", data.email);
        uploadFormData.append("image", selectedFile);

        const uploadResponse = await fetch("/api/profile/update", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || "Failed to upload image");
        }
        uploadedImageUrl = uploadResult.imageUrl; // e.g. /uploads/userId-timestamp.jpg
      }

      // Step 2: Send the update to Express PUT /api/auth/:id (saves to MongoDB)
      const nameParts = data.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      const payload: any = {
        firstName,
        lastName,
        email: data.email,
        bio: data.bio || null,
        phone: data.phone || null,
      };

      if (uploadedImageUrl) {
        payload.profileImage = uploadedImageUrl;
      }

      if (imageRemoved) {
        payload.removeImage = "true";
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // attach token for Express isAuthenticated
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");

      if (uploadedImageUrl) {
        setImagePreview(uploadedImageUrl);
      } else if (imageRemoved) {
        setImagePreview(null);
      }

      // Reset file state
      setSelectedFile(null);
      setImageRemoved(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err.message || "Failed to update profile. Please try again.");
      console.error("Profile update error:", err);
    }
  };

  const displayName = initialData?.name || "User";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto"
    >
      {/* Messages */}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      {/* Profile Image */}
      <div className="flex flex-col items-center space-y-3">
        <div className="relative group">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-pink-200 shadow-lg">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FallbackAvatar name={displayName} />
            )}
          </div>

          {/* Hover overlay */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer"
          >
            <span className="text-xs text-white font-medium">Change</span>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Buttons */}
        <div className="flex gap-2 w-full">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 px-3 py-2 text-xs rounded-md bg-pink-100 text-pink-600 font-medium hover:bg-pink-200"
          >
            Choose Photo
          </button>

          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={!imagePreview}
            className="flex-1 px-3 py-2 text-xs rounded-md bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Remove
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          JPG, PNG, GIF, WebP • Max 5MB
        </p>
      </div>

      {/* Name */}
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="john@example.com"
          className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone (optional)
        </label>
        <input
          id="phone"
          type="text"
          placeholder="9812345678"
          className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-xs text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-1">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio (optional)
        </label>
        <textarea
          id="bio"
          rows={3}
          placeholder="Tell us about yourself..."
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none resize-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-xs text-red-600">{errors.bio.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-10 w-full rounded-md bg-pink-400 text-white text-sm font-semibold hover:bg-pink-500 disabled:opacity-60"
      >
        {isSubmitting ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}