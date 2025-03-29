'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Nav Bar */}
      <div className="w-full border-b-2 border-black p-4 pixel-border-bottom">
        <h1 className="text-xl font-bold text-center tracking-wide">TRADR</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center p-4 gap-6">
        {/* Header */}
        <div className="text-center">
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-2xl mb-2"
          >
            📊
          </motion.div>
          <h2 className="text-2xl font-bold tracking-wide">BUY OR SELL</h2>
          <p className="text-sm tracking-wide mt-1">The game for traders.</p>
        </div>

        {/* Menu Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <motion.button
            className="w-full py-4 bg-yellow-300 text-black rounded-lg pixel-button pixel-border flex items-center justify-center text-lg font-bold tracking-wide"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/auth')}
          >
            <div className="flex items-center justify-center gap-2">
              <motion.span 
                className="text-xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎮
              </motion.span>
              NEW GAME
            </div>
          </motion.button>

          <motion.button
            className="w-full py-4 bg-yellow-300 text-black rounded-lg pixel-button pixel-border flex items-center justify-center text-lg font-bold tracking-wide"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <motion.span 
                className="text-xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                ⚔️
              </motion.span>
              1-1 BATTLE
            </div>
          </motion.button>

          <motion.button
            className="w-full py-4 bg-yellow-300 text-black rounded-lg pixel-button pixel-border flex items-center justify-center text-lg font-bold tracking-wide"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <motion.span 
                className="text-xl"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🏆
              </motion.span>
              LEADERBOARD
            </div>
          </motion.button>
        </div>

        {/* High Score */}
        <motion.div 
          className="w-full max-w-sm bg-yellow-100 rounded-lg p-4 text-center pixel-border space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="font-bold tracking-wide">HIGHEST SCORE</h3>
          <p className="text-3xl font-bold text-green-500">+10,250</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-white pixel-border flex items-center justify-center">
              <span className="text-xl">👑</span>
            </div>
            <span className="text-sm font-bold">@USERNAME</span>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p 
          className="text-xs text-gray-400 mt-4"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          INSERT COIN TO CONTINUE
        </motion.p>
      </div>
    </main>
  );
}
