import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parsePatientName(fullName: string) {
  const parts = fullName.trim().split(" ");
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ") ?? "";
  return { firstName, lastName };
}

export function formatValue(value: string, suffix: string = ""): string {
  if (value === undefined || value === null || value === "") return "Noma'lum";
  return `${value}${suffix}`;
}

export function formatList(list?: string[]): string {
  if (!list || list.length === 0) return "Noma'lum";
  return list.join(", ");
}
