"use client";

import React, { useState } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import { UserDTO } from "../../types/chat";

interface AddReviewModalProps {
  reviewedUserId: string;
  profileUser: UserDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewAdded: (
    comment: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const AddReviewModal: React.FC<AddReviewModalProps> = (props) => {
  const { profileUser, onClose, onReviewAdded, isOpen } = props;
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const result = await onReviewAdded(comment);

    if (result.success) {
      setComment("");
      onClose();
    } else {
      setSubmitError(result.error || "An error occurred.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 bg-white p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">New Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black placeholder-gray-400"
            rows={4}
            placeholder={`Comment for ${profileUser?.firstname || "user"}...`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
            required
          />

          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md active:scale-95"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Sending...</span>
            ) : (
              <>
                <FaPaperPlane />
                <span>Submit Review</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;
