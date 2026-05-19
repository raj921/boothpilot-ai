import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

export function leadScoreMultiplier(score: number) {
  if (score >= 85) return 1;
  if (score >= 70) return 0.7;
  if (score >= 50) return 0.4;
  return 0.25;
}
