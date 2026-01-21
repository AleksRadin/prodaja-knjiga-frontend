import { useState, useEffect, useCallback } from "react";
import { Review } from "../types/review";
import { UserDTO, ChatRoom } from "../types/chat";
import toast from "react-hot-toast";

export const useProfile = (userId: string) => {
  const [profileUser, setProfileUser] = useState<any | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
      };

      const [userRes, reviewsRes] = await Promise.all([
        fetch(`http://localhost:8080/api/auth/${userId}`, { headers }),
        fetch(`http://localhost:8080/api/review/user/${userId}`, { headers }),
      ]);

      if (!userRes.ok) throw new Error("Korisnik nije pronađen.");
      if (!reviewsRes.ok) throw new Error("Greška pri učitavanju recenzija.");

      const userData: UserDTO = await userRes.json();
      const reviewsData: Review[] = await reviewsRes.json();

      setProfileUser(userData);
      setReviews(reviewsData);
    } catch (err: any) {
      setError(err.message || "Greška pri učitavanju podataka.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const deleteReview = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/review/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
          },
        }
      );

      const message = await response.text();

      if (!response.ok)
        throw new Error(message || "Error: Failed to delete review.");

      toast.success(message);

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const updateReview = async (reviewId: number, newComment: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/review/update/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
          },
          body: JSON.stringify({ comment: newComment }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update review.");
      }

      const result = await response.json();

      toast.success(result.message);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? result.data : r))
      );
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const addReview = async (reviewedUserId: string, comment: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/review/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
        },
        body: JSON.stringify({
          reviewedId: parseInt(reviewedUserId),
          comment: comment,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(errorText || "An error occurred.");
        throw new Error(errorText);
      }

      const result = await response.json();
      toast.success(result.message);
      setReviews((prev) => [result.data, ...prev]);

      return { success: true };
    } catch (err: any) {
      return { success: false };
    }
  };

  const startChat = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/chatRoom?user2Id=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Neuspešno kreiranje ili dobavljanje četa.");

      const data: ChatRoom = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  return {
    profileUser,
    reviews,
    loading,
    error,
    setError,
    deleteReview,
    updateReview,
    addReview,
    startChat,
    refreshReviews: fetchProfileData,
  };
};
