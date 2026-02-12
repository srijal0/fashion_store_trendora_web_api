"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "./CartContext";

// Favorite product type
export interface FavoriteProduct extends Product {}

// Context type
interface FavoritesContextType {
  favorites: FavoriteProduct[];
  addToFavorites: (product: FavoriteProduct) => void;
  removeFromFavorites: (id: number) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);

  const addToFavorites = (product: FavoriteProduct) => {
    setFavorites((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromFavorites = (id: number) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
