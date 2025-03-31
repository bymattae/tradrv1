import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TRADR - The Trading Game',
  description: 'Trade, compete, and earn rewards in the most exciting trading game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans h-full bg-gray-50`}>
        <main className="min-h-[100dvh] bg-white">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
