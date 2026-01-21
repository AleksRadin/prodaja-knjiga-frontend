import { UserRole } from "./auth";

export interface UserDTO {
  id: number;
  firstname: string; 
  lastname: string;  
  email: string;
  phoneNumber?: string;
  role: UserRole;
}

export interface ChatMessageDTO {
  id: number;
  chatRoomId: number;
  sender: UserDTO;
  content: string;
  sentAt: string;
}

export interface ChatRoom {
  id: number;
  user1: UserDTO;
  user2: UserDTO;
}
