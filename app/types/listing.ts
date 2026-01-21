import { UserDTO } from "./chat";

export enum BookCondition {
  NEW = "NEW",
  USED = "USED",
}

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
}

export interface Listing {
  id: number;
  books: Book[];
  price: number;
  condition: BookCondition;
  description: string;
  createdAt: string;
  user: UserDTO;
}

export interface Favorite {
  id: number;
  createdAt: string;
  listing: Listing;
  user: {
    id: number;
    email: string;
  };
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
