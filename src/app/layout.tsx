import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tradr - The Game for Traders',
  description: 'A fun trading game where you can battle friends and climb the leaderboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-[100dvh] bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
