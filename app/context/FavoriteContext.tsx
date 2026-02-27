"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "./CartContext";

export interface FavoriteProduct extends Product {}

interface FavoritesContextType {
  favorites: FavoriteProduct[];
  addToFavorites: (product: FavoriteProduct) => void;
  removeFromFavorites: (id: number) => void;
  clearFavorites: () => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // ── Load from localStorage on first mount ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem("trendora_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // corrupted storage — start fresh
    }
    setHydrated(true);
  }, []);

  // ── Persist to localStorage whenever favorites change ──
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("trendora_favorites", JSON.stringify(favorites));
    }
  }, [favorites, hydrated]);

  const addToFavorites = (product: FavoriteProduct) => {
    setFavorites((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev; // already saved
      return [...prev, product];
    });
  };

  const removeFromFavorites = (id: number) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  const clearFavorites = () => setFavorites([]);

  const isFavorite = (id: number) => favorites.some((p) => p.id === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, clearFavorites, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};