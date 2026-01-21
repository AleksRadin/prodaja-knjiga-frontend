export const getInits = (firstname: string) => firstname ? firstname[0].toUpperCase() : "?";

export const formatChatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getRoomId = (userId1: number, userId2: number): string => {
  return [userId1, userId2].sort().join("_");
};


