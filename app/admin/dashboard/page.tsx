"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get admin data from cookie or fetch from API
    const fetchAdminData = async () => {
      try {
        // You can fetch admin data from your API here
        const admin = {
          name: "Admin",
          email: "admin@example.com",
        };
        setAdminData(admin);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">👗</span>
              <div>
                <h1 className="text-2xl font-bold text-red-600">Trendora</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="text-gray-600 hover:text-red-600 transition"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  // Add logout logic here
                  router.push("/login");
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-red-500 to-red-400 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {adminData?.name || "Admin"}! 👋
          </h2>
          <p className="text-red-100">
            Manage your Trendora fashion store from here
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">248</p>
              </div>
              <div className="text-5xl">📦</div>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">156</p>
              </div>
              <div className="text-5xl">👥</div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Revenue</p>
                <p className="text-3xl font-bold text-gray-800">$12.5k</p>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Products</p>
                <p className="text-3xl font-bold text-gray-800">89</p>
              </div>
              <div className="text-5xl">👗</div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Users */}
          <Link href="/admin/users">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Manage Users
              </h3>
              <p className="text-gray-600 mb-4">
                View and manage all registered users
              </p>
              <div className="text-red-500 font-medium">View Users →</div>
            </div>
          </Link>

          {/* Create User */}
          <Link href="/admin/create">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">➕</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Create User
              </h3>
              <p className="text-gray-600 mb-4">
                Add new users to the system
              </p>
              <div className="text-red-500 font-medium">Create User →</div>
            </div>
          </Link>

          {/* Manage Orders */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Manage Orders
            </h3>
            <p className="text-gray-600 mb-4">
              Track and manage all fashion orders
            </p>
            <div className="text-red-500 font-medium">View Orders →</div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="text-5xl mb-4">👗</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Fashion Inventory
            </h3>
            <p className="text-gray-600 mb-4">
              Manage fashion products and stock
            </p>
            <div className="text-red-500 font-medium">Manage Products →</div>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Analytics
            </h3>
            <p className="text-gray-600 mb-4">
              View sales reports and statistics
            </p>
            <div className="text-red-500 font-medium">View Analytics →</div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="text-5xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Settings
            </h3>
            <p className="text-gray-600 mb-4">
              Configure system settings
            </p>
            <div className="text-red-500 font-medium">Open Settings →</div>
          </div>
        </div>
      </main>
    </div>
  );
}