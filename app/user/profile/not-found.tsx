import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
          {/* 404 Illustration */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="text-8xl font-bold text-pink-200">404</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-6xl">🌸</span>
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Profile Not Found
            </h1>
            <p className="text-gray-600 text-sm">
              The profile page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          {/* Possible Reasons */}
          <div className="bg-pink-50 border border-pink-200 rounded-md p-4 text-left">
            <p className="text-sm font-semibold text-pink-800 mb-2">
              Possible reasons:
            </p>
            <ul className="text-xs text-pink-700 space-y-1 list-disc list-inside">
              <li>The URL was typed incorrectly</li>
              <li>The profile has been deleted</li>
              <li>You don&apos;t have permission to view this page</li>
              <li>The page has been moved to a new location</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/user/profile"
              className="block w-full h-10 rounded-md bg-pink-400 text-white text-sm font-semibold hover:bg-pink-500 transition-colors leading-10"
            >
              👤 Go to My Profile
            </Link>

            <Link
              href="/dashboard"
              className="block w-full h-10 rounded-md bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors leading-10"
            >
              🏠 Go to Dashboard
            </Link>

            <Link
              href="/"
              className="block text-sm text-pink-500 hover:text-pink-600 font-medium"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Help Text */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? Contact support or check your account settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}