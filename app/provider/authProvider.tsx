"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthContext, {
  type AuthContextType,
  type AuthData,
  type UserRole,
} from "../context/UserContext";

const useAuthLogic = (): Omit<AuthContextType, "setError"> & {
  setError: React.Dispatch<React.SetStateAction<string>>;
} => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [user, setUser] = useState<{
    id: number | string;
    name: string;
    role: UserRole;
  } | null>(null);

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      setError("");
      const email = localStorage.getItem("userEmail");
      const token = localStorage.getItem("token")?.trim();

      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/change-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email, oldPassword, newPassword }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          setError(errorText || "Failed to change password.");
          return false;
        }
        return true;
      } catch (err) {
        setError("Server error. Please try again later.");
        return false;
      }
    },
    []
  );

  const requestReset = useCallback(async (email: string) => {
    setError("");
    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/request-reset/${email}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || "User not found.");
        return false;
      }
      return true;
    } catch (err) {
      setError("Server error. Please try again later.");
      return false;
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setError("");
      try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          setError("Invalid credentials");
          return;
        }

        const data: AuthData = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", email);

        setUser({
          id: data.id,
          name: data.name,
          role: data.role,
        });
        setIsLoggedIn(true);

        router.push("/");
      } catch (err) {
        setError("Server error. Please try again later.");
      }
    },
    [router]
  );

  const register = useCallback(
    async (
      firstname: string,
      lastname: string,
      email: string,
      password: string,
      phoneNumber?: string
    ) => {
      setError("");
      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstname,
              lastname,
              email,
              password,
              phoneNumber,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          setError(errorText || "Registration failed. Please check your data.");
          return;
        }

        const data: AuthData = await response.json();
        localStorage.setItem("token", data.token);

        setUser({
          id: data.id,
          name: data.name,
          role: data.role,
        });
        setIsLoggedIn(true);

        router.push("/");
      } catch (err) {
        setError("Server error during registration. Please try again later.");
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    setError("");
    router.push("/login");
  }, [router]);

  const checkAuthStatus = useCallback(() => {
    setIsAuthLoading(true);
    const token = localStorage.getItem("token");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = payload.exp * 1000;
        const timeLeft = expirationTime - Date.now();

        if (timeLeft <= 0) {
          logout();
          return;
        }

        timerRef.current = setTimeout(() => {
          logout();
        }, timeLeft);

        const userId = payload.id || payload.userId;
        const rawRole = payload.role || payload.authority || "REGULAR";
        const userName = payload.sub || payload.email || "User";
        const cleanRole = (Array.isArray(rawRole) ? rawRole[0] : rawRole)
          .replace("ROLE_", "")
          .toUpperCase() as UserRole;

        if (userId) {
          setUser({
            id: userId,
            name: userName,
            role: cleanRole,
          });
          setIsLoggedIn(true);
        } else {
          throw new Error("Missing user ID in token payload.");
        }
        setIsAuthLoading(false);
      } catch (e) {
        localStorage.removeItem("token");
        setUser(null);
        setIsLoggedIn(false);
        setIsAuthLoading(false);
        logout();
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
      setIsAuthLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    isLoggedIn,
    isAuthLoading,
    error,
    login,
    logout,
    setError,
    user,
    register,
    changePassword,
    requestReset,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authLogic = useAuthLogic();

  return (
    <AuthContext.Provider value={authLogic}>{children}</AuthContext.Provider>
  );
};
