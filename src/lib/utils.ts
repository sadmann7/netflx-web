import { env } from "@/env.mjs"
import type { MediaType } from "@/types"
import { MEDIA_TYPE } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function getYear(input: string | number): number {
  const date = new Date(input)
  return date.getFullYear()
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function formatEnum(input: string): string {
  const words = input.split("_")
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  })
  return capitalizedWords.join(" ")
}

export function convertToMediaTypeEnum(input: string): MEDIA_TYPE {
  if (input === "movie") return MEDIA_TYPE.MOVIE
  if (input === "tv") return MEDIA_TYPE.TV
  throw new Error("Invalid media type")
}

export function convertToMediaTypeString(input: MEDIA_TYPE): MediaType {
  if (input === MEDIA_TYPE.MOVIE) return "movie"
  if (input === MEDIA_TYPE.TV) return "tv"
  throw new Error("Invalid media type")
}
