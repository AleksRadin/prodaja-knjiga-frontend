"use client";

import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useReports } from "../hooks/useReports";
import { ReportStatus } from "../types/report";

const statusStyles: Record<ReportStatus, string> = {
  OPEN: "bg-yellow-100 text-yellow-700 border-yellow-300",
  CLOSED: "bg-gray-100 text-gray-600 border-gray-300",
};

const AllReportsPage = () => {
  const { isLoggedIn } = useAuth();
  const { reports, isLoading, error, updateStatus, closeReport, refresh } =
    useReports(isLoggedIn);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen text-indigo-600">
        Loading reports...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded max-w-lg">
          {error}
        </div>
      </div>
    );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Reports Management Panel
      </h1>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
            <p className="text-gray-500 text-lg">No reports found</p>
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-indigo-600">
                  {report.title}
                </h2>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${
                    statusStyles[report.status]
                  }`}
                >
                  {report.status}
                </span>
              </div>

              <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                {report.message}
              </p>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Last Modified: {new Date(report.createdAt).toLocaleString()}
                </p>

                {report.status === "OPEN" && (
                  <button
                    onClick={() => closeReport(report.id)}
                    disabled={updateStatus[report.id]}
                    className={`font-bold py-2 px-4 rounded-lg text-sm transition ${
                      updateStatus[report.id]
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-500 hover:bg-indigo-600 text-white"
                    }`}
                  >
                    {updateStatus[report.id] ? "Updating..." : "Close Report"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={refresh}
        className="mt-8 mx-auto block bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm transition"
      >
        Refresh List
      </button>
    </div>
  );
};

export default AllReportsPage;
