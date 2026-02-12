"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/app/context/FavoriteContext";
import { useCart } from "@/app/context/CartContext";

export default function DashboardNav({ user }: { user: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  let cart: any[] = [];
  let favorites: any[] = [];

  try {
    const cartContext = useCart();
    cart = cartContext?.cart || [];
  } catch (error) {
    console.error("Cart context error:", error);
  }

  try {
    const favContext = useFavorites();
    favorites = favContext?.favorites || [];
  } catch (error) {
    console.error("Favorites context error:", error);
  }

  const cartCount = cart.reduce(
    (sum: number, item: any) => sum + (item.quantity || 1),
    0
  );

  const favoritesCount = mounted ? favorites.length : 0;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link
            href="/dashboard"
            className="text-2xl font-bold tracking-wide text-black hover:opacity-80 transition"
          >
            Trendora
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
            <Link href="/dashboard" className="hover:text-black transition">
              Home
            </Link>
            <Link href="/dashboard/about" className="hover:text-black transition">
              About
            </Link>
            <Link href="/dashboard/contact" className="hover:text-black transition">
              Contact
            </Link>
            <Link href="/dashboard/orders" className="hover:text-black transition">
              Orders
            </Link>
            <Link href="/dashboard/settings" className="hover:text-black transition">
              Settings
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            
            {/* Favorites */}
            <Link
              href="/dashboard/favorites"
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              ❤️
              {mounted && favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/dashboard/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link
              href="/dashboard/profile"
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              👤
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-3 bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition"
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}
