import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path;
  if (process.env.NEXT_PUBLIC_HOST)
    return `${process.env.NEXT_PUBLIC_HOST}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function constructMetadata({
  title = "TestNix - Split Testing",
  description = "TestNix is an SaaS application that helps you to track your A/B tests and make data-driven decisions.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    icons,
    metadataBase: new URL('https://trckify.live'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}