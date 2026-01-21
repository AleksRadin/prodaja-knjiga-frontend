"use client";

import React, { useState, useEffect, useRef } from "react";
import { UserDTO, ChatMessageDTO } from "../../types/chat";
import { formatChatTime } from "../../utility/chatUtils";

type ChatWindowProps = {
  activeChatRoomId: number;
  otherUser: UserDTO;
  currentUserId: number;
  messages: ChatMessageDTO[];
  loading: boolean;
  onSendMessage: (roomId: number, content: string) => Promise<boolean>;
};

const ChatWindow: React.FC<ChatWindowProps> = (props) => {
  const {
    activeChatRoomId,
    otherUser,
    currentUserId,
    messages = [],
    loading,
    onSendMessage,
  } = props;
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, directContent?: string) => {
    if (e) e.preventDefault();

    const content = directContent || newMessage.trim();
    if (!content) return;

    setNewMessage("");
    const success = await onSendMessage(activeChatRoomId, content);

    if (!success && !directContent) {
      setNewMessage(content);
    }
  };

  const quickMessages = [
    "Hi, is this book still available?",
    "Where can we meet for the pickup?",
    "Is the price negotiable?",
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div
        ref={scrollRef}
        className="flex-grow p-4 overflow-y-auto space-y-3 scroll-smooth"
      >
        {loading ? (
          <div className="text-center text-gray-400 mt-10 animate-pulse font-medium">
            Loading conversation...
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => {
            const isMe = msg.sender.id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[75%] shadow-sm ${
                    isMe
                      ? "bg-green-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 text-right ${
                      isMe ? "text-green-100" : "text-gray-400"
                    }`}
                  >
                    {formatChatTime(msg.sentAt)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Start a conversation with {otherUser.firstname}
            </h3>
            <p className="text-sm text-gray-500 mt-2 max-w-[280px]">
              Send a message to agree on the price or a meeting place.
            </p>

            <div className="mt-8 flex flex-col space-y-2 w-full max-w-xs">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                Quick Actions
              </p>
              {quickMessages.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(undefined, text)}
                  className="bg-white border border-green-200 text-green-700 text-sm py-2.5 px-4 rounded-xl hover:bg-green-50 transition-all shadow-sm text-left active:scale-95"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-3 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
            placeholder="Write a message..."
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700 disabled:bg-gray-300 disabled:shadow-none transition-all font-semibold text-sm"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
