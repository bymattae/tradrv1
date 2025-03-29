'use client';

import './globals.css';
import { Press_Start_2P } from 'next/font/google';
import NavigationBar from './components/NavigationBar';
import { usePathname } from 'next/navigation';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine if we should show the back button based on the current path
  const showBack = !['/'].includes(pathname);

  return (
    <html lang="en" className={pressStart2P.className}>
      <body>
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
