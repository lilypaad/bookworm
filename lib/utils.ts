import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  return text
    .replace(/\.[^/.]+$/, '') // remove file extensions
    .toLowerCase()
    .trim()
    .replace(/[^\ws-]/g, '') // remove special characters
    .replace(/[\s_]+/g, '-') // replaces spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '') // remove leading/trailing hyphens
}

export function serialiseData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}