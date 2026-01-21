"use client";

import React from "react";
import { ChatRoom, UserDTO } from "../../types/chat";
import { getInits } from "../../utility/chatUtils";

type ChatListProps = {
  chatRooms: ChatRoom[];
  activeChatRoomId: number | undefined;
  onSelectRoom: (room: ChatRoom) => void;
  getOtherUser: (room: ChatRoom) => UserDTO;
};

const ChatList: React.FC<ChatListProps> = (props) => {
  const { chatRooms, activeChatRoomId, onSelectRoom, getOtherUser } = props;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-4 text-xl font-bold border-b border-gray-200 sticky top-0 bg-white text-gray-800">
        💬 Chats
      </div>

      <div className="overflow-y-auto flex-grow">
        {chatRooms.length === 0 ? (
          <p className="p-4 text-gray-500 text-sm italic text-center">
            No active chats found.
          </p>
        ) : (
          chatRooms.map((room) => {
            const otherUser = getOtherUser(room);
            const isActive = room.id === activeChatRoomId;

            return (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className={`p-4 border-b border-gray-50 cursor-pointer transition flex items-center space-x-3
                  ${
                    isActive
                      ? "bg-green-50 border-l-4 border-green-500"
                      : "hover:bg-gray-50"
                  }`}
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                  {getInits(otherUser.firstname)}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {otherUser.firstname} {otherUser.lastname}
                    </h4>
                    <span className="text-[10px] text-gray-400">12:30</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    Click to open chat...
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;
