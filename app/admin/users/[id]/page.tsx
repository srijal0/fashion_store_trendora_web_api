// app/admin/users/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getUserById } from "@/lib/api/admin.api";

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
  createdAt: string;
  updatedAt: string;
}

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getUserById(id as string);
      setUser(data.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading user...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white rounded-lg shadow-md p-8 max-w-sm w-full mx-4">
          <p className="text-red-500 text-sm mb-4">{error || "User not found"}</p>
          <Link
            href="/admin/users"
            className="px-4 py-2 bg-pink-400 text-white text-sm font-semibold rounded-md hover:bg-pink-500"
          >
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  // Get proxied image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("/uploads")) {
      return `/api/image-proxy?url=${encodeURIComponent(
       `${process.env.NEXT_PUBLIC_API_BASE_URL}${imagePath}`
      )}`;
    }
    return imagePath;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/users"
              className="text-sm text-gray-500 hover:text-pink-500 transition-colors"
            >
              ← Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
          </div>
          <Link
            href={`/admin/users/${id}/edit`}
            className="px-4 py-2 bg-pink-400 text-white text-sm font-semibold rounded-md hover:bg-pink-500 transition-colors"
          >
            Edit User
          </Link>
        </div>
      </div>

      {/* User Detail Card */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-pink-200 bg-pink-100 flex items-center justify-center">
              {user.profileImage ? (
                <img
                  src={getImageUrl(user.profileImage) || ""}
                  alt={user.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-pink-600">
                  {user.firstName ? user.firstName[0] : user.email[0].toUpperCase()}
                </span>
              )}
            </div>

            {/* Name + Role */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : "No Name"}
              </h2>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  user.role === "admin"
                    ? "bg-pink-100 text-pink-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ID */}
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">User ID</p>
              <p className="text-sm text-gray-700 break-all">{user.id}</p>
            </div>

            {/* Username */}
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Username</p>
              <p className="text-sm text-gray-700">{user.username}</p>
            </div>

            {/* Email */}
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Email</p>
              <p className="text-sm text-gray-700">{user.email}</p>
            </div>

            {/* Phone */}
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Phone</p>
              <p className="text-sm text-gray-700">{user.phone || "Not provided"}</p>
            </div>

            {/* Role */}
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Role</p>
              <p className="text-sm text-gray-700 capitalize">{user.role}</p>
            </div>

            {/* Created At */}
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Joined</p>
              <p className="text-sm text-gray-700">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Updated At */}
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Last Updated</p>
              <p className="text-sm text-gray-700">
                {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Bio - spans full width */}
            <div className="bg-gray-50 rounded-md p-3 sm:col-span-2">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Bio</p>
              <p className="text-sm text-gray-700">{user.bio || "No bio provided"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
