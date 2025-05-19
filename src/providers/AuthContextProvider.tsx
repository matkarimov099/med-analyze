import { type PropsWithChildren, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.ts";
import type { CurrentUser } from "@/types/auth.ts";
import { useLogout } from "@/hooks/useAuth.ts";

type AuthContextProviderProps = PropsWithChildren;

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem("accessToken"),
  );
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const {
    mutate: logout,
    isSuccess: logoutSuccess,
    isError: logoutError,
    isPending: logoutPending,
  } = useLogout();

  useEffect(() => {
    if (authToken) {
      try {
        // Decode Base64 token (mock JWT-like)
        const decoded = JSON.parse(atob(authToken)) as CurrentUser;
        setCurrentUser(decoded);
      } catch (error) {
        console.error("Invalid token", error);
        setAuthToken(null);
        localStorage.removeItem("accessToken");
      }
    } else {
      setCurrentUser(null);
    }
  }, [authToken]);

  const value = {
    authToken,
    setAuthToken,
    currentUser,
    logout,
    isLoading: logoutPending,
    isSuccessLogout: logoutSuccess,
    isErrorLogout: logoutError,
    isLoggedIn: Boolean(authToken),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
