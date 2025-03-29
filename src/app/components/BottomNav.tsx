'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', icon: '🏠', path: '/' },
    { label: 'Battle', icon: '⚔️', path: '/battle' },
    { label: 'Leaderboard', icon: '🏆', path: '/leaderboard' },
    { label: 'Profile', icon: '👤', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center gap-1 ${
                pathname === item.path ? 'text-black' : 'text-gray-500'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </nav>
  );
} 