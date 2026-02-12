"use client";

import { CartProvider } from "@/app/context/CartContext";
import { FavoritesProvider } from "@/app/context/FavoriteContext";
import { ReactNode } from "react";


export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </CartProvider>
  );
}