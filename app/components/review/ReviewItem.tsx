"use client";

import React, { useState } from "react";
import { Review } from "../../types/review";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

interface ReviewItemProps {
  review: Review;
  onDelete: (id: number) => void;
  onUpdate: (id: number, comment: string) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = (props) => {
  const { review, onDelete, onUpdate } = props;
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(review.comment);

  const isOwner = user && String(user.id) === String(review.reviewer?.id);
  const isAdmin = user?.role === "ADMIN";

  const handleUpdate = () => {
    onUpdate(review.id, editComment);
    setIsEditing(false);
  };

  return (
    <div className="border-b p-4 bg-white shadow rounded-lg mb-3 flex justify-between items-start">
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg text-gray-800">
            {review.reviewer?.firstname} {review.reviewer?.lastname}
            {isOwner && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                You
              </span>
            )}
          </p>
          <p className="text-sm text-gray-500">
            {review.createdAt
              ? new Date(review.createdAt).toLocaleDateString("sr-RS")
              : "N/A"}
          </p>
        </div>

        {isEditing ? (
          <div className="mt-2 flex flex-col space-y-2">
            <textarea
              className="w-full p-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
            />
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="text-green-600 flex items-center space-x-1 text-sm font-bold"
              >
                <FaCheck /> <span>Save</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 flex items-center space-x-1 text-sm"
              >
                <FaTimes /> <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-gray-700 italic">"{review.comment}"</p>
        )}
      </div>

      <div className="flex space-x-2 ml-4">
        {isOwner && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-400 hover:text-blue-600 p-2"
          >
            <FaEdit size={16} />
          </button>
        )}
        {(isOwner || isAdmin) && (
          <button
            onClick={() => onDelete(review.id)}
            className="text-red-400 hover:text-red-600 p-2"
          >
            <FaTrash size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;
