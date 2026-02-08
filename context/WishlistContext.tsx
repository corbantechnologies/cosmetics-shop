"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface WishlistItem {
  product_reference: string;
  added_at: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (productRef: string) => void;
  removeFromWishlist: (productRef: string) => void;
  isInWishlist: (productRef: string) => boolean;
  toggleWishlist: (productRef: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

const WISHLIST_STORAGE_KEY = "clate_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setWishlist(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      setWishlist([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      } catch (error) {
        console.error("Failed to save wishlist:", error);
      }
    }
  }, [wishlist, isInitialized]);

  const addToWishlist = (productRef: string) => {
    setWishlist((prev) => {
      // Check if already in wishlist
      if (prev.some((item) => item.product_reference === productRef)) {
        return prev;
      }
      return [
        ...prev,
        {
          product_reference: productRef,
          added_at: new Date().toISOString(),
        },
      ];
    });
  };

  const removeFromWishlist = (productRef: string) => {
    setWishlist((prev) =>
      prev.filter((item) => item.product_reference !== productRef),
    );
  };

  const isInWishlist = (productRef: string): boolean => {
    return wishlist.some((item) => item.product_reference === productRef);
  };

  const toggleWishlist = (productRef: string) => {
    if (isInWishlist(productRef)) {
      removeFromWishlist(productRef);
    } else {
      addToWishlist(productRef);
    }
  };

  const value: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
