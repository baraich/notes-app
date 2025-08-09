import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeConversationsLink(id: string) {
  return `/c/${id}`;
}

export const makeDocumentsLink = (id: string) => `/d/${id}`;

export function getActualPrice(price: number) {
  return price * 90;
}
