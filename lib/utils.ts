import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function formatDate(date?: string | Date, format?: "long" | "short" | "iso") {
  if (!date) return "N/A"
  const d = new Date(date)
  if (isNaN(d.getTime())) return "N/A"

  switch (format) {
    case "short":
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
    case "iso":
      return d.toISOString().split("T")[0]
    default:
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(d)
  }
}