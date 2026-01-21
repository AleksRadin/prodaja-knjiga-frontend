import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

interface FavoriteMarkProps {
  listingId: number;
  isFavorite: boolean;
  onToggleFavorite: (listingId: number) => void;
}

const FavoriteMarkComponent: React.FC<FavoriteMarkProps> = (props) => {
  const { listingId, isFavorite, onToggleFavorite } = props;
  const { isLoggedIn } = useAuth();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please login to save favorites!");
      return;
    }
    onToggleFavorite(listingId);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-1 transform transition hover:scale-110 active:scale-90"
      aria-label={isFavorite ? "Remove from favorites" : "Add to Favorites"}
    >
      {isFavorite ? (
        <FaStar
          className="text-yellow-500 hover:text-yellow-600 transition-colors"
          size={20}
        />
      ) : (
        <FaRegStar
          className="text-gray-400 hover:text-yellow-500 transition-colors"
          size={20}
        />
      )}
    </button>
  );
};

export const FavoriteMark = React.memo(FavoriteMarkComponent);
