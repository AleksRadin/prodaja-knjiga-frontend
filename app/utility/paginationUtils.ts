export const getPaginationRange = (currentPage: number, totalPages: number, range: number = 5) => {
  let start = Math.max(0, currentPage - Math.floor(range / 2));
  let end = start + range;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(0, end - range);
  }

  return Array.from({ length: end - start }, (_, i) => start + i);
};