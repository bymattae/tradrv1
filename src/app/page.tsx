'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Nav Bar */}
      <div className="w-full border-b border-black p-4">
        <h1 className="text-xl font-bold text-center">TRADR</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center p-4 gap-6">
        {/* Header */}
        <div className="text-center pt-12 pb-8">
          <motion.h2 
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            BUY OR SELL
          </motion.h2>
          <motion.p 
            className="text-sm mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            The game for traders.
          </motion.p>
        </div>

        {/* Menu Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <motion.button
            className="w-full py-4 bg-green-400 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold gap-2 transition-all duration-200 hover:bg-green-500"
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => router.push('/auth')}
          >
            <span>NEW GAME</span>
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎮
            </motion.span>
          </motion.button>

          <motion.button
            className="w-full py-4 bg-blue-400 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold gap-2 transition-all duration-200 hover:bg-blue-500"
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span>1-1 BATTLE</span>
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⚔️
            </motion.span>
          </motion.button>

          <motion.button
            className="w-full py-4 bg-purple-400 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold gap-2 transition-all duration-200 hover:bg-purple-500"
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span>LEADERBOARD</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🏆
            </motion.span>
          </motion.button>
        </div>

        {/* High Score */}
        <motion.div 
          className="w-full max-w-sm bg-yellow-100 border-2 border-black rounded-none p-4 text-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-bold">HIGHEST SCORE</h3>
          <p className="text-3xl font-bold text-green-500">+10,250</p>
          <div className="flex items-center justify-center gap-2">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'User avatar'}
                width={32}
                height={32}
                className="border-2 border-black"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 border-2 border-black flex items-center justify-center">
                👤
              </div>
            )}
            <span className="text-sm font-bold">
              @{user?.displayName || 'anonymous'}
            </span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
