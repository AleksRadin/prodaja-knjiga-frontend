import { useState } from "react";
import { Listing, Book, BookCondition } from "../types/listing";
import { toast } from "react-hot-toast";

export const useListingForm = (onSuccess: () => void) => {
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [condition, setCondition] = useState<BookCondition>(BookCondition.NEW);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setSelectedBooks([]);
    setPrice(0);
    setCondition(BookCondition.NEW);
    setDescription("");
    setError(null);
    setShowForm(false);
    setEditingListing(null);
  };

  const startEdit = (listing: Listing) => {
    setEditingListing(listing);
    setSelectedBooks(listing.books || []);
    setPrice(listing.price);
    setCondition(listing.condition as BookCondition);
    setDescription(listing.description);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingListing;
    const url = isEdit
      ? `http://localhost:8080/api/listings/update/${editingListing.id}`
      : "http://localhost:8080/api/listings/create";

    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
        },
        body: JSON.stringify({
          books: selectedBooks.map((b) => ({
            id: b.id > 0 ? b.id : null,
            title: b.title,
            author: b.author,
            publisher: b.publisher,
          })),
          price,
          condition,
          description,
        }),
      });

      const messageFromServer = await response.text();

      if (!response.ok) {
        throw new Error(messageFromServer);
      }
      //if (!response.ok) throw new Error("Neuspešna akcija na serveru.");

      toast.success(messageFromServer);
      resetForm();
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
      //setError(err.message);
    }
  };

  const formProps = {
    selectedBooks,
    setSelectedBooks,
    price,
    setPrice,
    condition,
    setCondition,
    description,
    setDescription,
    error,
    isEditMode: !!editingListing,
    currentListingId: editingListing?.id,
  };

  return {
    showForm,
    setShowForm,
    formProps,
    startEdit,
    resetForm,
    handleSubmit,
  };
};
