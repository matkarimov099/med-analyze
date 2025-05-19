import { createContext } from "react";
import type { CurrentUser } from "@/types/auth.ts";

interface AuthContextType {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  currentUser: CurrentUser | null;
  logout: () => void;
  isLoading: boolean;
  isSuccessLogout: boolean;
  isErrorLogout: boolean;
  isLoggedIn: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
