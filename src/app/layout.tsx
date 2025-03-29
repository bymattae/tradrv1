'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import NavigationBar from './components/NavigationBar';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine if we should show the back button based on the current path
  const showBack = !['/'].includes(pathname);

  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationBar 
          showBack={showBack}
          xp={0} // This should be connected to your global state management
          userAvatar={null} // This should be connected to your global state management
        />
        <div className="pt-14">
          {children}
        </div>
      </body>
    </html>
  );
}
