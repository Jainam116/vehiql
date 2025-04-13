import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num) => {
  // Use a fixed locale (en-US) to ensure consistent formatting between server and client
  return new Intl.NumberFormat("en-US").format(num);
};
