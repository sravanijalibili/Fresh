import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");

      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error("Unable to load wishlist:", error);

      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const isWishlisted = (productId) => {
    return wishlistItems.some(
      (item) => Number(item.id) === Number(productId)
    );
  };

  const toggleWishlist = (product) => {
    setWishlistItems((previous) => {
      const exists = previous.some(
        (item) => Number(item.id) === Number(product.id)
      );

      if (exists) {
        return previous.filter(
          (item) => Number(item.id) !== Number(product.id)
        );
      }

      return [...previous, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((previous) =>
      previous.filter(
        (item) => Number(item.id) !== Number(productId)
      )
    );
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}