"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("account");

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("account")}
          className={`pb-3 px-4 font-semibold transition ${
            activeTab === "account"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`pb-3 px-4 font-semibold transition ${
            activeTab === "notifications"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`pb-3 px-4 font-semibold transition ${
            activeTab === "privacy"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Privacy
        </button>
      </div>

      {/* Account Tab */}
      {activeTab === "account" && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="w-24">
                    <input
                      type="text"
                      value="+977"
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-semibold"
                    />
                  </div>
                  <input
                    type="tel"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="98XXXXXXXX"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: +977 98XXXXXXXX</p>
              </div>

              <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">
                Save Changes
              </button>
            </div>
          </div>

          <hr className="my-6" />

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
            <div className="space-y-4">
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Current Password"
              />
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="New Password"
              />
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Confirm New Password"
              />
              <button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold transition">
                Update Password
              </button>
            </div>
          </div>

          <hr className="my-6" />

          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h2>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <div className="font-semibold text-gray-800">Order Updates</div>
                <div className="text-sm text-gray-500">Get notified about your order status</div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-pink-500" defaultChecked />
            </label>

            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <div className="font-semibold text-gray-800">Promotions</div>
                <div className="text-sm text-gray-500">Receive special offers and discounts</div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-pink-500" defaultChecked />
            </label>

            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <div className="font-semibold text-gray-800">New Arrivals</div>
                <div className="text-sm text-gray-500">Be the first to know about new flowers</div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-pink-500" />
            </label>
          </div>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Privacy Settings</h2>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <div className="font-semibold text-gray-800">Profile Visibility</div>
                <div className="text-sm text-gray-500">Make your profile visible to others</div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-pink-500" defaultChecked />
            </label>

            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <div className="font-semibold text-gray-800">Show Order History</div>
                <div className="text-sm text-gray-500">Allow others to see your purchases</div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-pink-500" />
            </label>

            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <div className="font-semibold text-gray-800">Data Collection</div>
                <div className="text-sm text-gray-500">Allow us to collect usage data</div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-pink-500" defaultChecked />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}