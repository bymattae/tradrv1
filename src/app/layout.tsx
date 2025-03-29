import './globals.css';
import { Press_Start_2P } from 'next/font/google';
import NavigationBar from './components/NavigationBar';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'TRADR',
  description: 'A game by Matt James',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={pressStart2P.className}>
      <body>
        <NavigationBar />
        <div className="pt-14">
          {children}
        </div>
      </body>
    </html>
  );
}
