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
  noIndex = false,
  keywords = ['testing', 'split', 'ab', 'experiments', 'variants', 'analytics', 'clicks', 'conversions', 'impressions']
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean,
  keywords?: string[]
} = {}): Metadata {
  return {
    title,
    description,
    keywords,
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
    metadataBase: new URL('https://testnix.vercel.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    }),
    other: {
      "google-site-verification": "co0B-CYrqRdI_fmi2ySiu2nYjJd2Wq8Db9ESsAv_uZE"
    }
  }
}