'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Nav Bar */}
      <div className="w-full border-b border-black p-4">
        <h1 className="text-xl font-bold text-center">TRADR</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center p-4 gap-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold">BUY OR SELL</h2>
          <p className="text-sm mt-1">The game for traders.</p>
        </div>

        {/* Menu Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <motion.button
            className="w-full py-4 bg-yellow-300 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold"
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/auth')}
          >
            NEW GAME
          </motion.button>

          <motion.button
            className="w-full py-4 bg-yellow-300 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold"
            whileTap={{ scale: 0.98 }}
          >
            1-1 BATTLE
          </motion.button>

          <motion.button
            className="w-full py-4 bg-yellow-300 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold"
            whileTap={{ scale: 0.98 }}
          >
            LEADERBOARD
          </motion.button>
        </div>

        {/* High Score */}
        <div className="w-full max-w-sm bg-yellow-100 border-2 border-black rounded-none p-4 text-center space-y-2">
          <h3 className="font-bold">HIGHEST SCORE</h3>
          <p className="text-3xl font-bold text-green-500">+10,250</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center">
              👑
            </div>
            <span className="text-sm font-bold">@USERNAME</span>
          </div>
        </div>
      </div>
    </main>
  );
}
