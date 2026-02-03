// app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/me");
        if (!response.ok) {
          throw new Error("Not authenticated");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Logout function
  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        {/* Logo / Brand */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-red-500">👗 Trendora</h1>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors ${
              pathname === "/dashboard"
                ? "bg-red-50 text-red-600 font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <span>📊</span>
            Dashboard
          </Link>

          {/* Users - Admin Section */}
          <div className="pt-4">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">
              Admin
            </p>

            {/* All Users */}
            <Link
              href="/admin/users"
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors ${
                pathname === "/admin/users"
                  ? "bg-red-50 text-red-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span>👥</span>
              Users
            </Link>

            {/* Create User */}
            <Link
              href="/admin/users/create"
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors ${
                pathname === "/admin/users/create"
                  ? "bg-red-50 text-red-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span>➕</span>
              Create User
            </Link>
          </div>

          {/* User Section */}
          <div className="pt-4">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">
              Account
            </p>

            {/* Profile */}
            <Link
              href="/user/profile"
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors ${
                pathname === "/user/profile"
                  ? "bg-red-50 text-red-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span>👤</span>
              Profile
            </Link>
          </div>
        </nav>

        {/* Bottom - User Info + Logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            {/* Small Avatar */}
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
              <span className="text-sm font-semibold text-red-600">
                {user?.firstName ? user.firstName[0] : user?.email?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email || "User"}
              </p>
              <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600 font-semibold">
                {user?.role || "user"}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}