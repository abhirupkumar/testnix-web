import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'simplebar-react/dist/simplebar.min.css';
import { cn, constructMetadata } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import NextTopLoader from 'nextjs-toploader';
import Layout from '@/components/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen font-sans antialiased grainy',
          inter.className
        )}>
        <NextTopLoader color="#FA1768" showSpinner={false} />
        <Toaster />
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
