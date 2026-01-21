import { useState, useEffect, useCallback } from "react";
import { Report } from "../types/report";
import toast from "react-hot-toast";

export const useReports = (isLoggedIn: boolean) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<Record<number, boolean>>({});

  const fetchReports = useCallback(async () => {
    if (!isLoggedIn) {
      setError("You must be logged in to view reports.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/report", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch reports.");
      const data: Report[] = await response.json();
      setReports(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  const closeReport = async (reportId: number) => {
    setUpdateStatus((prev) => ({ ...prev, [reportId]: true }));
    try {
      const response = await fetch(
        `http://localhost:8080/api/report/update/${reportId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const result = await response.json(); 

      toast.success(result.message);

      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? result.data : r))
      );
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdateStatus((prev) => ({ ...prev, [reportId]: false }));
    }
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    isLoading,
    error,
    updateStatus,
    closeReport,
    refresh: fetchReports,
  };
};
