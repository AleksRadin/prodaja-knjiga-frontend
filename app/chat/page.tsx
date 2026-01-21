"use client";

import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";
import { useSearchParams } from "next/navigation";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";

const ChatPage = () => {
  const { isLoggedIn, user } = useAuth();
  const searchParams = useSearchParams();
  const roomIdFromUrl = searchParams.get("roomId");
  const {
    chatRooms,
    activeChatRoom,
    setActiveChatRoom,
    messages,
    messagesLoading,
    sendMessage,
    loading,
    error,
    getOtherUser,
  } = useChat(isLoggedIn, user);

  useEffect(() => {
    if (roomIdFromUrl && chatRooms.length > 0) {
      const targetRoom = chatRooms.find(
        (r) => r.id.toString() === roomIdFromUrl
      );
      if (targetRoom) {
        setActiveChatRoom(targetRoom);
      }
    }
  }, [roomIdFromUrl, chatRooms]);

  if (loading)
    return (
      <div className="p-8 text-center text-lg text-gray-600">
        Loading chats...
      </div>
    );
  if (error)
    return <div className="p-8 text-red-600 text-center">Error: {error}</div>;

  if (!isLoggedIn || !user) {
    return (
      <div className="p-8 text-center text-lg text-red-500">
        Please log in to access the chat.
      </div>
    );
  }

  const currentUserId = Number(user.id);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-200">
      <div className="w-full sm:w-1/3 min-w-[300px] border-r border-gray-300 bg-white">
        <ChatList
          chatRooms={chatRooms}
          activeChatRoomId={activeChatRoom?.id}
          onSelectRoom={setActiveChatRoom}
          getOtherUser={getOtherUser}
        />
      </div>

      <div className="flex-grow w-full sm:w-2/3">
        {activeChatRoom ? (
          <ChatWindow
            activeChatRoomId={activeChatRoom.id}
            otherUser={getOtherUser(activeChatRoom)}
            currentUserId={currentUserId}
            messages={messages}
            loading={messagesLoading}
            onSendMessage={sendMessage}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex items-center justify-center h-full flex-col text-gray-400 p-10 bg-gray-50">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke="currentColor"
      className="w-20 h-20 mb-4 opacity-20"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
      />
    </svg>
    <p className="text-xl font-medium text-gray-500">Your Messages</p>
    <p>Select a conversation from the left to start chatting.</p>
  </div>
);

export default ChatPage;
