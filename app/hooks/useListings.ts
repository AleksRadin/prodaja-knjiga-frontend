import { useState, useEffect, useCallback } from "react";
import { Listing, Book, Author } from "../types/listing";
import { PaginatedResponse } from "../types/api";
import toast from "react-hot-toast";

export const useListings = (searchTerm: string, favoritesOnly: boolean) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: "5",
        fav: favoritesOnly.toString(),
      });

      if (searchTerm) params.append("filter", searchTerm);

      const response = await fetch(
        `http://localhost:8080/api/listings?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
          },
        }
      );

      if (!response.ok) throw new Error("Neuspešno učitavanje listinga.");

      const data: PaginatedResponse<Listing> = await response.json();
      setListings(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, favoritesOnly]);

  const fetchAllAuthors = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/author");
      if (response.ok) {
        const data = await response.json();
        setAllAuthors(data);
      }
    } catch (err) {
      console.error("Error fetching authors:", err);
    }
  };

  const fetchAllBooks = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/books");
      if (response.ok) {
        const data = await response.json();
        setAllBooks(data);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const deleteListing = useCallback(async (listingId: number) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/listings/${listingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
          },
        }
      );

      const messageFromServer = await response.text();

      if (!response.ok) {
        throw new Error(messageFromServer || "Error: Failed to delete.");
      }

      toast.success(messageFromServer);

      setListings((prev) => prev.filter((l) => l.id !== listingId));
    } catch (err: any) {
      //setError(err.message);
      toast.error(err.message);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchListings();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchListings]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, favoritesOnly]);

  useEffect(() => {
    fetchAllBooks();
    fetchAllAuthors();
  }, []);

  return {
    listings,
    allBooks,
    allAuthors,
    page,
    setPage,
    totalPages,
    loading,
    error,
    deleteListing,
    refresh: fetchListings,
  };
};
