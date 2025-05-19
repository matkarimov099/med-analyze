import type { CurrentUser } from "@/types/auth.ts";

export function isAuthenticated(): boolean {
  const token = localStorage.getItem("accessToken");
  return !!token; // Token mavjud bo‘lsa true, aks holda false
}

export function getUserFromToken(): CurrentUser | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    return JSON.parse(atob(token)) as CurrentUser;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}
