"use client";

import { useState } from "react";
import { Book, BookCondition, Author } from "../../types/listing";
import { FaEdit, FaTimes, FaPlus } from "react-icons/fa";
import {
  generateDefaultBook,
  generateDefaultAuthor,
  removeItemById,
  handleInputChange,
  updateListField,
} from "../../utility/formUtils";
import { isBookValid } from "../../utility/validation";
import toast from "react-hot-toast";

interface ListingFormProps {
  selectedBooks: Book[];
  setSelectedBooks: (books: Book[]) => void;
  allBooks: Book[];
  allAuthors: Author[];
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

const DEFAULT_AUTHOR_STATE = { firstname: "", lastname: "" };

export const ListingForm: React.FC<ListingFormProps> = (props) => {
  const {
    selectedBooks,
    setSelectedBooks,
    allBooks,
    allAuthors,
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
  const [manualAuthor, setManualAuthor] = useState(DEFAULT_AUTHOR_STATE);
  const [isManualAuthorMode, setIsManualAuthorMode] = useState(false);

  const handleSelectExisting = (bookId: number) => {
    const selected = allBooks.find((b) => b.id === bookId);
    if (selected && !selectedBooks.some((b) => b.id === bookId)) {
      setSelectedBooks([...selectedBooks, selected]);
    }
  };

  const handleSelectAuthorForNewBook = (authorId: number) => {
    const selected = allAuthors.find((a) => a.id === authorId);
    if (selected && !newBook.authors.some((a) => a.id === authorId)) {
      setNewBook({
        ...newBook,
        authors: [...newBook.authors, selected],
      });
    } else {
      toast.error("Author has already been added");
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

  const handleAddNewAuthorToBook = () => {
    if (!manualAuthor.firstname || !manualAuthor.lastname) {
      toast.error("Please enter both first and last name for the author.");
      return;
    }

    const tempAuthor: Author = {
      ...generateDefaultAuthor(),
      firstname: manualAuthor.firstname,
      lastname: manualAuthor.lastname,
    };

    setNewBook({
      ...newBook,
      authors: [...newBook.authors, tempAuthor],
    });

    setManualAuthor(DEFAULT_AUTHOR_STATE);
    setIsManualAuthorMode(false);
  };

  const handleUpdateAuthorsInExistingBook = (
    bookId: number,
    authorId: number,
  ) => {
    const author = allAuthors.find((a) => a.id === authorId);
    if (!author) return;

    const updatedBooks = selectedBooks.map((book) => {
      if (book.id === bookId) {
        if (book.authors.some((a) => a.id === authorId)) return book;
        return { ...book, authors: [...book.authors, author] };
      }
      return book;
    });
    setSelectedBooks(updatedBooks);
  };

  const handleRemoveAuthorFromExistingBook = (
    bookId: number,
    authorId: number,
  ) => {
    const updatedBooks = selectedBooks.map((book) => {
      if (book.id === bookId) {
        return {
          ...book,
          authors: book.authors.filter((a) => a.id !== authorId),
        };
      }
      return book;
    });
    setSelectedBooks(updatedBooks);
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
                {book.title} — {book.authors.map((a) => a.lastname).join(", ")}
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
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-4 shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                placeholder="Publisher"
                value={newBook.publisher}
                onChange={(e) =>
                  handleInputChange(setNewBook, "publisher", e.target.value)
                }
                className="border p-2 rounded-md bg-white outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="space-y-3">
              {!isManualAuthorMode ? (
                <div className="flex gap-2">
                  <select
                    className="flex-grow p-2.5 border rounded-md text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400"
                    defaultValue=""
                    onChange={(e) =>
                      handleSelectAuthorForNewBook(Number(e.target.value))
                    }
                  >
                    <option value="" disabled>
                      Select existing author...
                    </option>
                    {allAuthors.map((a) => (
                      <option key={a.id} value={a.id!}>
                        {a.firstname} {a.lastname}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsManualAuthorMode(true)}
                    className="text-xs bg-blue-100 text-blue-700 px-3 rounded hover:bg-blue-200 transition"
                  >
                    + New Author
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-md border border-blue-200">
                  <input
                    placeholder="First Name"
                    className="p-2 border rounded text-sm flex-1 min-w-[120px] outline-none focus:ring-2 focus:ring-blue-400"
                    value={manualAuthor.firstname}
                    onChange={(e) =>
                      setManualAuthor({
                        ...manualAuthor,
                        firstname: e.target.value,
                      })
                    }
                  />
                  <input
                    placeholder="Last Name"
                    className="p-2 border rounded text-sm flex-1 min-w-[120px] outline-none focus:ring-2 focus:ring-blue-400"
                    value={manualAuthor.lastname}
                    onChange={(e) =>
                      setManualAuthor({
                        ...manualAuthor,
                        lastname: e.target.value,
                      })
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAddNewAuthorToBook}
                      className="bg-green-600 text-white p-2 rounded text-xs hover:bg-green-700"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsManualAuthorMode(false)}
                      className="bg-gray-400 text-white p-2 rounded text-xs hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {newBook.authors.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {newBook.authors.map((a) => (
                    <span
                      key={a.id}
                      className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm"
                    >
                      {a.firstname} {a.lastname}
                      <FaTimes
                        className="cursor-pointer hover:text-red-300"
                        onClick={() =>
                          setNewBook({
                            ...newBook,
                            authors: newBook.authors.filter(
                              (at) => at.id !== a.id,
                            ),
                          })
                        }
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddNewBook}
              className="w-full bg-blue-600 text-white rounded-md py-2.5 hover:bg-blue-700 font-bold transition shadow-md"
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
                      by{" "}
                      {book.authors
                        ?.map((a) => `${a.firstname} ${a.lastname}`)
                        .join(", ")}
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
                  <div className="mt-3 pt-3 border-t space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                    <div className="bg-gray-50 p-2 rounded-lg border border-dashed border-gray-300">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase">
                        Manage Authors:
                      </p>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {book.authors.map((a) => (
                          <span
                            key={a.id}
                            className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1"
                          >
                            {a.firstname[0]}. {a.lastname}
                            <FaTimes
                              className="cursor-pointer hover:text-red-500"
                              onClick={() => {
                                if (a.id !== undefined && a.id !== null) {
                                  handleRemoveAuthorFromExistingBook(
                                    book.id,
                                    a.id,
                                  );
                                }
                              }}
                            />
                          </span>
                        ))}
                      </div>

                      <select
                        className="w-full p-1.5 border rounded text-xs bg-white"
                        defaultValue=""
                        onChange={(e) => {
                          handleUpdateAuthorsInExistingBook(
                            book.id,
                            Number(e.target.value),
                          );
                          e.target.value = "";
                        }}
                      >
                        <option value="" disabled>
                          Add another author...
                        </option>
                        {allAuthors.map((a) => (
                          <option key={a.id} value={a.id ?? ""}>
                            {a.firstname} {a.lastname}
                          </option>
                        ))}
                      </select>
                    </div>
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
          placeholder="Describe the condition or any damage to the books..."
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
