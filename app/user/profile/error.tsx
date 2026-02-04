"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Profile page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Error Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 text-sm">
              We encountered an error while loading your profile.
            </p>
          </div>

          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-700 font-mono break-words">
              {error.message || "An unexpected error occurred"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full h-10 rounded-md bg-pink-400 text-white text-sm font-semibold hover:bg-pink-500 transition-colors"
            >
              🔄 Try Again
            </button>

            <Link
              href="/dashboard"
              className="block w-full h-10 rounded-md bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors leading-10"
            >
              🏠 Go to Dashboard
            </Link>

            <Link
              href="/login"
              className="block text-sm text-pink-500 hover:text-pink-600 font-medium"
            >
              Or try logging in again
            </Link>
          </div>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === "development" && error.digest && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Error Digest: <code className="font-mono">{error.digest}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}