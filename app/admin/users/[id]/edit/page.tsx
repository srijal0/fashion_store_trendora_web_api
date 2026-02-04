// app/admin/users/[id]/edit/page.tsx
"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getUserById, updateUser } from "@/lib/api/admin.api";

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  phone: string;
  role: string;
  profileImage: string;
}

export default function AdminUserEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Form data state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    bio: "",
    phone: "",
    role: "user",
  });

  // Fetch user data when page loads
  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getUserById(id as string);
      const user = data.data;

      // Fill form with existing data
      setFormData({
        username: user.username || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        phone: user.phone || "",
        role: user.role || "user",
      });

      // Set image preview
      if (user.profileImage) {
        const proxiedUrl = user.profileImage.startsWith("/uploads")
          ? `/api/image-proxy?url=${encodeURIComponent(
             `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.profileImage}`
          )}`
          : user.profileImage;
        setImagePreview(proxiedUrl);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
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
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
    setShouldRemoveImage(false);
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setImagePreview("");
    setSelectedFile(null);
    setShouldRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // Create FormData
      const form = new FormData();
      form.append("username", formData.username);
      form.append("email", formData.email);
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("bio", formData.bio);
      form.append("phone", formData.phone);
      form.append("role", formData.role);

      // Handle image
      if (shouldRemoveImage) {
        form.append("removeImage", "true");
      } else if (selectedFile) {
        form.append("image", selectedFile);
      }

      // Call update API
      await updateUser(id as string, form);

      setSuccess("User updated successfully!");

      // Redirect after 1 second
      setTimeout(() => {
        router.push(`/admin/users/${id}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  // Default avatar letter
  const getDefaultAvatar = () => {
    return formData.firstName
      ? formData.firstName[0].toUpperCase()
      : formData.email
      ? formData.email[0].toUpperCase()
      : "U";
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/users/${id}`}
              className="text-sm text-gray-500 hover:text-pink-500 transition-colors"
            >
              ← Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
        >
          {/* Messages */}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative group">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-pink-200 shadow-lg bg-pink-100 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-pink-600">
                    {getDefaultAvatar()}
                  </span>
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

            {/* Choose & Remove buttons */}
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

            <p className="text-xs text-gray-500">JPG, PNG, GIF, WebP • Max 5MB</p>
          </div>

          {/* First Name + Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username"
              className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Phone (optional)</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9812345678"
              className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Bio (optional)</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about this user..."
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none resize-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
            />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="h-10 w-full rounded-md bg-pink-400 text-white text-sm font-semibold hover:bg-pink-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
}