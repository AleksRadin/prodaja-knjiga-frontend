import { Book, Author } from "../types/listing";

export const generateTempId = () => Math.floor(Math.random() * -1000000000);

export const generateDefaultAuthor = (): Author => ({
  id: generateTempId(),
  firstname: "",
  lastname: "",
});

export const generateDefaultBook = (): Book => ({
  id: generateTempId(),
  title: "",
  authors: [],
  publisher: "",
});

export const handleInputChange = <T>(
  setter: React.Dispatch<React.SetStateAction<T>>,
  field: keyof T,
  value: any,
) => {
  setter((prev) => ({ ...prev, [field]: value }));
};

export const updateListField = <T extends { id: number }>(
  list: T[],
  id: number,
  field: keyof T,
  value: any,
): T[] => {
  return list.map((item) =>
    item.id === id ? { ...item, [field]: value } : item,
  );
};

export const removeItemById = <T extends { id: number }>(
  list: T[],
  id: number,
): T[] => {
  return list.filter((item) => item.id !== id);
};
