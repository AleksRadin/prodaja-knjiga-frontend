import { useState } from "react";
import toast from "react-hot-toast";

export const useCreateReport = (isLoggedIn: boolean) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast.error("Please enter both title and message.");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please login before you send report");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("http://localhost:8080/api/report/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
        },
        body: JSON.stringify({ title, message }),
      });

      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(errorText || "Slanje reporta nije uspelo.");
      }

      const result = await response.json();

      toast.success(result.message);
      setTitle("");
      setMessage("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSending(false);
    }
  };

  return {
    title,
    setTitle,
    message,
    setMessage,
    isSending,
    successMessage,
    error,
    handleSubmit,
  };
};
