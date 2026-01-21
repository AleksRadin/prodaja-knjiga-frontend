"use client";

import React from "react";
import { FaTrashAlt, FaEdit, FaUserCircle } from "react-icons/fa";
import { FavoriteMark } from "../FavoriteMark";
import Link from "next/link";
import { Listing } from "../../types/listing";

interface ListingItemProps {
  listing: Listing;
  currentUserId?: string | number;
  currentUserRole?: string;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onEdit: (listing: Listing) => void;
  onDelete: (id: number) => void;
}

const ListingItemComponent: React.FC<ListingItemProps> = (props) => {
  const {
    listing,
    currentUserId,
    currentUserRole,
    isFavorite,
    onToggleFavorite,
    onEdit,
    onDelete,
  } = props;
  const conditionLabel = listing.condition === "NEW" ? "Nova" : "Korišćena";
  const isOwner =
    listing.user && String(listing.user.id) === String(currentUserId);
  const isAdmin = currentUserRole === "ADMIN";

  return (
    <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center transition hover:shadow-md">
      <div>
        {listing.books && listing.books.length > 0 ? (
          <div className="space-y-2">
            {listing.books.map((b, index) => (
              <div
                key={b.id}
                className={index !== 0 ? "border-t pt-2 border-gray-50" : ""}
              >
                <h3 className="text-lg font-semibold leading-tight">
                  {b.title}
                </h3>
                <p className="text-gray-600 text-xs">
                  {b.author} – {b.publisher}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Bez informacija o knjigama</p>
        )}
        <p className="text-gray-500 mt-1 italic text-sm line-clamp-2">
          {listing.description}
        </p>
      </div>

      <div className="text-right flex items-center space-x-3">
        <div className="mr-4 text-right">
          <p className="font-bold text-lg text-blue-600 whitespace-nowrap">
            {listing.price} RSD
          </p>
          <p
            className={`text-xs uppercase tracking-wide px-2 py-1 rounded ${
              listing.condition === "NEW"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {conditionLabel}
          </p>
        </div>

        <FavoriteMark
          listingId={listing.id}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />

        {listing.user?.id && (
          <Link
            href={`/profile/${listing.user.id}`}
            className="text-gray-400 hover:text-blue-500 transition-colors"
            title="Pogledaj profil prodavca"
          >
            <FaUserCircle size={24} />
          </Link>
        )}

        {(isOwner || isAdmin) && (
          <div className="flex space-x-1 border-l pl-3 ml-2 border-gray-100">
            <button
              onClick={() => onEdit(listing)}
              className="text-yellow-500 hover:text-yellow-600 p-2 transition-colors"
              aria-label="Izmeni listing"
            >
              <FaEdit size={18} />
            </button>
            <button
              onClick={() => onDelete(listing.id)}
              className="text-red-500 hover:text-red-600 p-2 transition-colors"
              aria-label="Obriši listing"
            >
              <FaTrashAlt size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ListingItem = React.memo(ListingItemComponent);
