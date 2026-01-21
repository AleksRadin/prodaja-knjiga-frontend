import React from "react";
import { getPaginationRange } from "../utility/paginationUtils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = (props) => {
  const { currentPage, totalPages, onPageChange } = props;
  if (totalPages <= 1) return null;

  const range = 5;
  const pages = getPaginationRange(currentPage, totalPages, range);

  const lastPageInRange = pages[pages.length - 1];
  // let start = Math.max(0, currentPage - Math.floor(range / 2));
  // let end = start + range;

  // if (end > totalPages) {
  //   end = totalPages;
  //   start = Math.max(0, end - range);
  // }

  // const pages = Array.from({ length: end - start }, (_, i) => start + i);

  return (
    <div className="flex justify-center items-center space-x-2 mt-10 mb-10 w-full max-w-3xl">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-1 bg-white border rounded disabled:opacity-30 hover:bg-gray-50 transition"
      >
        Prev
      </button>

      {pages.map((item) => (
        <button
          key={item}
          onClick={() => {
            onPageChange(item);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`px-4 py-1 border rounded transition ${
            currentPage === item
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          {item + 1}
        </button>
      ))}

      {totalPages > range && lastPageInRange < totalPages - 1 && (
        <>
          <span className="px-2 text-gray-500">...</span>
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className={`px-4 py-1 border rounded transition ${
              currentPage === totalPages - 1
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-50 text-gray-700"
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-3 py-1 bg-white border rounded disabled:opacity-30 hover:bg-gray-50 transition"
      >
        Next
      </button>
    </div>
  );
};
