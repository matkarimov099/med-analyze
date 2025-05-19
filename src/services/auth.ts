import type { RegisterCredentials } from "@/types/auth.ts";
import { SHA256 } from "crypto-js";

const hashPassword = (password: string) => {
  return SHA256(password).toString();
};

export const registerUser = async (data: RegisterCredentials) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some((u: RegisterCredentials) => u.phone === data.phone)) {
    throw new Error("Phone number already registered");
  }

  // Parolni hashlash
  const hashedData = { ...data, password: hashPassword(data.password) };
  users.push(hashedData);
  localStorage.setItem("users", JSON.stringify(users));

  // Mock JWT-like token (Base64 encoded JSON)
  const payload = {
    phone: data.phone,
    firstname: data.firstname,
    lastname: data.lastname,
  };
  const token = btoa(JSON.stringify(payload));

  return { accessToken: token };
};

export const loginUser = async (data: { phone: string; password: string }) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(
    (u: RegisterCredentials) =>
      u.phone === data.phone && u.password === hashPassword(data.password),
  );
  if (!user) {
    throw new Error("Invalid phone number or password");
  }

  // Mock JWT-like token
  const payload = {
    phone: user.phone,
    firstname: user.firstname,
    lastname: user.lastname,
  };
  const token = btoa(JSON.stringify(payload));

  return { accessToken: token };
};

export const logoutUser = async () => {
  localStorage.removeItem("accessToken");
  return { success: true };
};
