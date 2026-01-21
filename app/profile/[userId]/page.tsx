"use client";

import React, { useState, use } from "react";
import {
  FaUserCircle,
  FaRegCommentDots,
  FaPaperPlane,
  FaInfoCircle,
  FaLock,
  FaArrowLeft,
} from "react-icons/fa";
import ReviewItem from "../../components/review/ReviewItem";
import AddReviewModal from "../../components/review/AddReviewModal";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ProfilePage = ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = use(params);
  const { user: currentUser, isAuthLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const {
    profileUser,
    reviews,
    loading: profileLoading,
    error,
    setError,
    deleteReview,
    updateReview,
    addReview,
    startChat,
  } = useProfile(userId);

  if (isAuthLoading || (profileLoading && !profileUser)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="italic text-gray-500 font-medium">
            Loading profile data...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-black">
        <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-100">
          <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <FaLock className="text-blue-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Protected Content
          </h2>
          <p className="text-gray-600 mb-10 leading-relaxed text-lg">
            Please log in to continue with this activity and view user profiles
            and their reviews.
          </p>
          <div className="flex flex-col space-y-4">
            <Link
              href="/login"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition transform active:scale-95 shadow-lg shadow-blue-100 flex items-center justify-center space-x-2"
            >
              <span>Login to Continue</span>
            </Link>
            <Link
              href="/"
              className="w-full bg-gray-50 text-gray-500 py-3 rounded-xl font-semibold hover:bg-gray-100 transition flex items-center justify-center space-x-2"
            >
              <FaArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleMessageClick = async () => {
    const chatRoom = await startChat();
    if (chatRoom) {
      router.push(`/chat?roomId=${chatRoom.id}`);
    }
  };

  const hasAlreadyReviewed = reviews.some(
    (r) => String(r.reviewer?.id) === String(currentUser?.id),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center text-black">
      <div className="w-full max-w-4xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold ml-4">
              ×
            </button>
          </div>
        )}

        <header className="bg-white p-6 rounded-xl shadow-md mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FaUserCircle size={50} className="text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold">
                {profileUser?.firstName || profileUser?.firstname}{" "}
                {profileUser?.lastName || profileUser?.lastname}
              </h1>
              <p className="text-gray-500 text-sm">User Profile</p>
            </div>
          </div>

          {currentUser && currentUser.id.toString() !== userId && (
            <div className="flex space-x-3">
              <button
                onClick={handleMessageClick}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-green-700 transition"
              >
                <FaRegCommentDots /> <span>Message</span>
              </button>

              {!hasAlreadyReviewed && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-700 transition"
                >
                  <FaPaperPlane /> <span>Write a Review</span>
                </button>
              )}
            </div>
          )}
        </header>

        {hasAlreadyReviewed && (
          <div className="mb-6 flex items-center space-x-2 bg-blue-50 text-blue-700 p-4 rounded-lg border border-blue-200 shadow-sm">
            <FaInfoCircle />
            <p className="text-sm font-medium italic">
              You have already shared your thoughts. You can edit or delete your
              review below.
            </p>
          </div>
        )}

        <AddReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          reviewedUserId={userId}
          profileUser={profileUser}
          onReviewAdded={(comment) => addReview(userId, comment)}
        />

        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <FaRegCommentDots className="text-blue-500" />
            <span>Reviews ({reviews.length})</span>
          </h2>
          <div className="space-y-3">
            {reviews.map((r) => (
              <ReviewItem
                key={r.id}
                review={r}
                onDelete={deleteReview}
                onUpdate={updateReview}
              />
            ))}
            {reviews.length === 0 && (
              <div className="text-center p-10 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400">
                  No reviews yet. Be the first to leave one!
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
