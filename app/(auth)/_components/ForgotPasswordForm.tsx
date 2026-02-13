"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/api/auth";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      
      if (response.success) {
        setSuccess(true);
        setEmail(""); // Clear email field
      }
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {success ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
            <p className="font-medium">✅ Email sent successfully!</p>
            <p className="text-sm mt-1">
              Please check your inbox for the password reset link.
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}