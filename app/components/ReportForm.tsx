import React from "react";

interface ReportFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => void;
  isSending: boolean;
  isButtonDisabled: boolean;
  isLoggedIn: boolean;
}

export const ReportForm: React.FC<ReportFormProps> = (props) => {
  const {
    title,
    setTitle,
    message,
    setMessage,
    handleSubmit,
    isSending,
    isButtonDisabled,
    isLoggedIn,
  } = props;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Report Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short title"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled={isSending}
          required
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="message"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Detailed Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the issue in detail..."
          rows={5}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled={isSending}
          required
        />
      </div>

      <div className="flex items-center justify-between flex-col">
        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`
            w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out
            ${
              isButtonDisabled
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }
          `}
        >
          {isSending ? "Submitting..." : "Submit Report"}
        </button>

        {!isLoggedIn && (
          <p className="text-red-500 text-sm italic mt-2">
            **Please log in to submit a report.**
          </p>
        )}
      </div>
    </form>
  );
};
