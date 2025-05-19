import { useContext } from "react";
import { AuthContext } from "@/providers/AuthContext.ts";

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within a AuthContext");
  }
  return context;
}
