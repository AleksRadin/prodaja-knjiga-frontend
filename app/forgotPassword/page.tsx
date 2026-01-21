"use client";

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { requestReset, error, setError } = useAuth();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isOk = await requestReset(email);
    if (isOk) setSuccess(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Request</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your email and the admin will reset your password to your
              email prefix.
            </p>
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold">
              Send Request
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-600 font-bold mb-4">Request Sent!</p>
            <p className="text-sm text-gray-500 mb-6">
              The admin has been notified. Check back soon.
            </p>
            <Link href="/login" className="text-blue-500 underline">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
