export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const truncateText = (text: string, limit: number): string => {
  if (text.length <= limit) return text;
  return text.substring(0, limit) + "...";
};

export const formatCondition = (condition: string): string => {
  return condition === "NEW" ? "Nova" : "Korišćena";
};