"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear cookies by expiring them
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie =
      "user_data=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

    // Redirect to login page
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded font-semibold"
    >
      Logout
    </button>
  );
}
