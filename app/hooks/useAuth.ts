import { useContext } from "react";
import AuthContext, { type AuthContextType } from "../context/UserContext";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth mora biti korišćen unutar AuthProvider-a");
  }
  return context;
};