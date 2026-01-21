"use Client";

import { useState } from "react";
import { Book, BookCondition } from "../../types/listing";
import { FaEdit, FaTimes, FaPlus } from "react-icons/fa";
import {
  generateDefaultBook,
  removeItemById,
  handleInputChange,
  updateListField,
} from "../../utility/formUtils";
import { isBookValid } from "../../utility/validation";

interface ListingFormProps {
  selectedBooks: Book[];
  setSelectedBooks: (books: Book[]) => void;
  allBooks: Book[];
  price: number;
  setPrice: (price: number) => void;
  condition: BookCondition;
  setCondition: (condition: BookCondition) => void;
  description: string;
  setDescription: (desc: string) => void;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isEditMode: boolean;
  currentListingId?: number;
}

export const ListingForm: React.FC<ListingFormProps> = (props) => {
  const {
    selectedBooks,
    setSelectedBooks,
    allBooks,
    price,
    setPrice,
    condition,
    setCondition,
    description,
    setDescription,
    error,
    handleSubmit,
    isEditMode,
  } = props;

  const [newBook, setNewBook] = useState<Book>(generateDefaultBook());
  const [addingNewBook, setAddingNewBook] = useState(false);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);

  const handleSelectExisting = (bookId: number) => {
    const selected = allBooks.find((b) => b.id === bookId);
    if (selected && !selectedBooks.some((b) => b.id === bookId)) {
      setSelectedBooks([...selectedBooks, selected]);
    }
  };

  const handleAddNewBook = () => {
    if (!isBookValid(newBook)) {
      alert("Please fill in all book fields (Title, Author, Publisher).");
      return;
    }
    setSelectedBooks([...selectedBooks, { ...newBook }]);
    setNewBook(generateDefaultBook());
    setAddingNewBook(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl mb-6 border border-gray-100"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        {isEditMode ? "Editing Listing" : "Create New Listing"}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-8">
        <label className="block font-bold text-gray-700">
          Books in this Listing
        </label>

        <div className="flex gap-2">
          <select
            onChange={(e) => handleSelectExisting(Number(e.target.value))}
            className="flex-grow border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
            defaultValue=""
          >
            <option value="" disabled>
              Select from library...
            </option>
            {allBooks?.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} — {book.author}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setAddingNewBook(!addingNewBook)}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              addingNewBook
                ? "bg-gray-200 text-gray-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {addingNewBook ? (
              "Cancel"
            ) : (
              <>
                <FaPlus /> New Book
              </>
            )}
          </button>
        </div>

        {addingNewBook && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-inner">
            <input
              type="text"
              placeholder="Title"
              value={newBook.title}
              onChange={(e) =>
                handleInputChange(setNewBook, "title", e.target.value)
              }
              className="border p-2 rounded-md bg-white outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Author"
              value={newBook.author}
              onChange={(e) =>
                handleInputChange(setNewBook, "author", e.target.value)
              }
              className="border p-2 rounded-md bg-white outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Publisher"
              value={newBook.publisher}
              onChange={(e) =>
                handleInputChange(setNewBook, "publisher", e.target.value)
              }
              className="border p-2 rounded-md bg-white outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={handleAddNewBook}
              className="bg-blue-600 text-white rounded-md py-2 sm:col-span-3 hover:bg-blue-700 font-bold transition"
            >
              Add to list
            </button>
          </div>
        )}

        <div className="mt-4 space-y-2">
          {selectedBooks.length === 0 ? (
            <p className="text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg">
              No books selected yet.
            </p>
          ) : (
            selectedBooks.map((book) => (
              <div
                key={book.id}
                className="border rounded-lg p-3 bg-white shadow-sm border-gray-200 hover:border-blue-200 transition"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-700">
                    {book.title}{" "}
                    <span className="text-gray-400 font-normal">
                      by {book.author}
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingBookId(
                          editingBookId === book.id ? null : book.id,
                        )
                      }
                      className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedBooks(removeItemById(selectedBooks, book.id))
                      }
                      className="text-red-400 hover:bg-red-50 p-2 rounded-full transition"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {editingBookId === book.id && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t">
                    <input
                      type="text"
                      value={book.title}
                      onChange={(e) =>
                        setSelectedBooks(
                          updateListField(
                            selectedBooks,
                            book.id,
                            "title",
                            e.target.value,
                          ),
                        )
                      }
                      className="border p-1.5 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      value={book.author}
                      onChange={(e) =>
                        setSelectedBooks(
                          updateListField(
                            selectedBooks,
                            book.id,
                            "author",
                            e.target.value,
                          ),
                        )
                      }
                      className="border p-1.5 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      value={book.publisher}
                      onChange={(e) =>
                        setSelectedBooks(
                          updateListField(
                            selectedBooks,
                            book.id,
                            "publisher",
                            e.target.value,
                          ),
                        )
                      }
                      className="border p-1.5 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <hr className="my-6 border-gray-100" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Price (RSD)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Condition
          </label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as BookCondition)}
            className="w-full border p-2.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          >
            <option value={BookCondition.NEW}>New</option>
            <option value={BookCondition.USED}>Used</option>
          </select>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Detailed Description
        </label>
        <textarea
          placeholder="Describe the condition, smell, or any damage to the books..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3 rounded-lg bg-gray-50 min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200 transform hover:-translate-y-1 active:scale-95"
      >
        {isEditMode ? "Save All Changes" : "Publish Listing"}
      </button>
    </form>
  );
};
