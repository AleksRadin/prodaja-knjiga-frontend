"use client";

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useListings } from "../hooks/useListings";
import { useListingForm } from "../hooks/useListingForm";
import { ListingForm } from "../components/listing/ListingForm";
import { ListingItem } from "../components/listing/ListingItem";
import { Pagination } from "../components/Pagination";
import { useFavorites } from "../hooks/useFavorites";

const ListingsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const {
    listings,
    allBooks,
    allAuthors,
    page,
    setPage,
    totalPages,
    loading,
    error,
    deleteListing,
    refresh,
  } = useListings(searchTerm, favoritesOnly);

  const { showForm, setShowForm, formProps, startEdit, handleSubmit } =
    useListingForm(refresh);
  const { favoriteIds, toggleFavorite } = useFavorites(isLoggedIn);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <header className="flex justify-between items-center w-full max-w-3xl mb-6">
        <h1 className="text-3xl font-bold">Market</h1>
        {isLoggedIn && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white rounded-full w-10 h-10 text-2xl"
          >
            {showForm ? "×" : "+"}
          </button>
        )}
      </header>

      {showForm && (
        <ListingForm
          {...formProps}
          allBooks={allBooks}
          allAuthors={allAuthors || []}
          handleSubmit={handleSubmit}
        />
      )}

      <div className="w-full max-w-3xl space-y-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />

        {isLoggedIn && (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(e) => setFavoritesOnly(e.target.checked)}
            />
            <span>Only favorite</span>
          </label>
        )}

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {(() => {
            const visibleListings = listings.filter(
              (l) => l.id !== formProps.currentListingId,
            );
            if (!loading && visibleListings.length === 0) {
              return (
                <div className="bg-white p-10 rounded-xl shadow-inner text-center border-2 border-dashed border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700">
                    No items found
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {searchTerm
                      ? `We couldn't find any results for "${searchTerm}"`
                      : "There are no listings available at the moment."}
                  </p>
                  {favoritesOnly && (
                    <p className="text-blue-500 text-sm mt-3 font-medium">
                      Try disabling the "Favorites only" filter.
                    </p>
                  )}
                </div>
              );
            }

            return visibleListings.map((listing) => (
              <ListingItem
                key={listing.id}
                listing={listing}
                currentUserId={user?.id}
                currentUserRole={user?.role}
                isFavorite={favoriteIds.includes(listing.id)}
                onToggleFavorite={toggleFavorite}
                onEdit={startEdit}
                onDelete={deleteListing}
              />
            ));
          })()}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default ListingsPage;
