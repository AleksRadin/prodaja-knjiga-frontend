import { UserDetails } from "./auth";

export interface Review {
  id: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: number;
    firstname: string;
    lastname: string;
  };
}