"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import "../globals.css";

export default function Navigation() {
  const { user, logout, isLoggedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = isLoggedIn && user?.role === "ADMIN";

  return (
    <nav className="flex items-center p-3 md:px-8 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-gray-700 font-medium hover:text-blue-600 transition"
        >
          Home
        </Link>
        <Link
          href="/listings"
          className="text-gray-700 font-medium hover:text-blue-600 transition"
        >
          Market
        </Link>
        {isLoggedIn && (
          <>
            <Link
              href="/report"
              className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
              Report
            </Link>
            <Link
              href="/chat"
              className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
              Chat
            </Link>
          </>
        )}
        {isAdmin && (
          <Link
            href="/reportsPreview"
            className="text-gray-700 font-medium hover:text-blue-600 transition"
          >
            Admin Reports
          </Link>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 font-medium text-gray-800 hover:text-blue-600 transition outline-none"
            >
              <span className="text-lg">👤</span>
              <span className="text-base">{user.name}</span>
              <span className="text-xs">▼</span>
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 text-black"
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <Link
                  href="/changePassword"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🔒 Change Password
                </Link>

                <hr className="my-1 border-gray-100" />

                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-gray-700 font-medium hover:text-blue-600 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
