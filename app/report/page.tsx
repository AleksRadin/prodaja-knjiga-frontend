"use client";

import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useCreateReport } from "../hooks/useCreateReport";
import { ReportForm } from "../components/ReportForm";

const ReportPage = () => {
  const { isLoggedIn } = useAuth();
  const {
    title,
    setTitle,
    message,
    setMessage,
    isSending,
    successMessage,
    error,
    handleSubmit,
  } = useCreateReport(isLoggedIn);

  const isButtonDisabled = !isLoggedIn || isSending;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Create New Report
        </h1>

        <ReportForm
          title={title}
          setTitle={setTitle}
          message={message}
          setMessage={setMessage}
          handleSubmit={handleSubmit}
          isSending={isSending}
          isButtonDisabled={isButtonDisabled}
          isLoggedIn={isLoggedIn}
        />

        {error && (
          <p className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded transition">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded transition">
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
