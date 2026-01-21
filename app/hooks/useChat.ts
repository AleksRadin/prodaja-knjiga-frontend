import { useState, useEffect, useCallback } from "react";
import { ChatRoom, UserDTO, ChatMessageDTO } from "../types/chat";
import toast from "react-hot-toast";

export const useChat = (isLoggedIn: boolean, user: any) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOtherUser = useCallback(
    (room: ChatRoom): UserDTO => {
      if (!user) throw new Error("User not defined.");
      return room.user1.id === user.id ? room.user2 : room.user1;
    },
    [user]
  );

  const fetchChatRooms = useCallback(async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/chatRoom/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch chat rooms.");

      const data: ChatRoom[] = await response.json();
      setChatRooms(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchMessages = useCallback(async (roomId: number) => {
    setMessagesLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/chatMessage/${roomId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch messages.");
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      toast.error("Error loading messages.");
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const sendMessage = async (roomId: number, content: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/chatMessage/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
          },
          body: JSON.stringify({ chatRoomId: roomId, content }),
        }
      );

      if (!response.ok) throw new Error("Slanje nije uspelo");

      const createdMessage: ChatMessageDTO = await response.json();
      setMessages((prev) => [...prev, createdMessage]);
      return true;
    } catch (err) {
      toast.error("Greška pri slanju poruke.");
      return false;
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  useEffect(() => {
    if (activeChatRoom) {
      fetchMessages(activeChatRoom.id);
    } else {
      setMessages([]);
    }
  }, [activeChatRoom, fetchMessages]);

  return {
    chatRooms,
    activeChatRoom,
    setActiveChatRoom,
    messages,
    loading,
    messagesLoading,
    error,
    getOtherUser,
    sendMessage,
    refreshRooms: fetchChatRooms,
  };
};
