import { Book } from "../types/listing";

export const isBookValid = (book: Book): boolean => {
  return !!(book.title.trim() && book.author.trim() && book.publisher.trim());
};

export const isPriceValid = (price: number): boolean => {
  return !isNaN(price) && price > 0;
};

export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isMinLength = (text: string, min: number): boolean => {
  return text.trim().length >= min;
};