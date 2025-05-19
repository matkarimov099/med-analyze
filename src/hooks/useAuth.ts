import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { ServerError } from "@/types/auth.ts";
import { loginUser, logoutUser, registerUser } from "@/services/auth.ts";

export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      navigate("/auth/sign-in");
    },
    onError: (error: ServerError) => {
      console.error("Registration failed", error);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      const redirectUrl = sessionStorage.getItem("redirectUrl") || "/home";
      sessionStorage.removeItem("redirectUrl");
      navigate(redirectUrl);
    },
    onError: (error: ServerError) => {
      console.error("Login failed", error);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      navigate("/auth/sign-in");
    },
    onError: (error: ServerError) => {
      console.error("Logout failed", error);
    },
  });
};
