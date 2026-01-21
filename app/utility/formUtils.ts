import { Book } from "../types/listing";

export const generateTempId = () => Date.now() * -1;

export const generateDefaultBook = (): Book => ({
  id: generateTempId(),
  title: "",
  author: "",
  publisher: "",
});

export const handleInputChange = <T>(
  setter: React.Dispatch<React.SetStateAction<T>>,
  field: keyof T,
  value: any
) => {
  setter((prev) => ({ ...prev, [field]: value }));
};

export const updateListField = <T extends { id: number }>(
  list: T[],
  id: number,
  field: keyof T,
  value: any
): T[] => {
  return list.map((item) =>
    item.id === id ? { ...item, [field]: value } : item
  );
};

export const removeItemById = <T extends { id: number }>(
  list: T[],
  id: number
): T[] => {
  return list.filter((item) => item.id !== id);
};
