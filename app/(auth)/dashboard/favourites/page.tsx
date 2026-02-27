"use client";


import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FavoriteProduct, useFavorites } from "@/app/context/FavoriteContext";

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  const handleAddToCart = (item: FavoriteProduct) => {
    setAddingToCart(item.id);

    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      discountedPrice: item.discountedPrice,
      quantity: 1,
      image: item.image,
      description: item.description,
      discount: item.discount,
    });

    setTimeout(() => {
      setAddingToCart(null);
      alert("Added to cart!");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
            <p className="text-gray-600 mt-1">
              {favorites.length} {favorites.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">🛍️</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No Favorites Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start adding your favorite Trendora items!
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-semibold"
            >
              Browse Trendora Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((item: FavoriteProduct) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition group"
              >
                {/* Image */}
                <div className="w-full h-48 relative mb-4">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-pink-50 rounded-lg flex items-center justify-center text-4xl">
                      👗
                    </div>
                  )}

                  {/* Discount Badge */}
                  {item.discount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      {item.discount}% OFF
                    </div>
                  )}

                  {/* Remove from Favorites Button */}
                  <button
                    onClick={() => removeFromFavorites(item.id)}
                    className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                    title="Remove from favorites"
                  >
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>

                {/* Name */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                  {item.name}
                </h2>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <p className="text-pink-600 font-bold text-lg">
                      Rs {item.discountedPrice || item.price}
                    </p>
                    {item.discountedPrice && (
                      <p className="text-gray-400 line-through text-sm">
                        Rs {item.price}
                      </p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={addingToCart === item.id}
                    className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition font-semibold disabled:opacity-50"
                  >
                    {addingToCart === item.id ? "Adding..." : "Add to Cart"}
                  </button>

                  <button
                    onClick={() => removeFromFavorites(item.id)}
                    className="w-full border border-red-300 text-red-600 py-2 rounded-lg hover:bg-red-50 transition font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {favorites.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 border border-pink-300 text-pink-600 rounded-lg hover:bg-pink-50 transition font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
