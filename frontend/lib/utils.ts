import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add a utility function to safely handle image sources
export function getSafeImageSrc(src: string | null | undefined): string | null {
  if (!src || src === "") {
    return null
  }
  return src
}

// Add a utility function to safely handle href values
export function getSafeHref(href: string | null | undefined): string {
  if (!href || href === "") {
    return "#"
  }
  return href
}
