import { useState, useEffect, useCallback } from "react";
import { Favorite } from "../types/listing";
import toast from "react-hot-toast";

export const useFavorites = (isLoggedIn: boolean) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const fetchFavorites = useCallback(async () => {
    if (!isLoggedIn) {
      setFavoriteIds([]);
      return;
    }
    
    try {
      const response = await fetch("http://localhost:8080/api/favorite", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch favorites");

      const favorites: Favorite[] = await response.json();
      setFavoriteIds(favorites.map((f) => f.listing.id));
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  }, [isLoggedIn]);

  const toggleFavorite = useCallback(
    async (listingId: number) => {
      if (!isLoggedIn) {
        toast.error("You must be logged in to mark favorites.");
        return;
      }

      const isCurrentlyFavorite = favoriteIds.includes(listingId);
      const method = isCurrentlyFavorite ? "DELETE" : "POST";
      const endpoint = isCurrentlyFavorite
        ? `http://localhost:8080/api/favorite/${listingId}`
        : `http://localhost:8080/api/favorite/create/${listingId}`;

      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
          },
        });

        const messageFromServer = await response.text();
        if (!response.ok)
          throw new Error(messageFromServer || "Error updating favorites.");

        toast.success(messageFromServer);

        setFavoriteIds((prevIds) =>
          isCurrentlyFavorite
            ? prevIds.filter((id) => id !== listingId)
            : [...prevIds, listingId]
        );
      } catch (err: any) {
        toast.error(err.message);
      }
    },
    [isLoggedIn, favoriteIds]
  );

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return { favoriteIds, toggleFavorite };
};
