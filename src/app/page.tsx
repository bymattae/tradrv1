'use client';

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-white relative">
      {/* Language selector */}
      <div className="absolute top-4 right-4">
        <button className="text-gray-600 text-xs">English ▾</button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto space-y-8">
        {/* Logo */}
        <motion.h1 
          className="game-title text-4xl font-bold tracking-tight text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          BUY OR SELL
        </motion.h1>
        <p className="text-sm text-gray-500">You choose.</p>

        {/* Menu buttons */}
        <div className="w-full space-y-4">
          <motion.button 
            className="w-full py-3 bg-green-200 hover:bg-green-300 text-black font-pixel rounded-lg pixel-button pixel-border flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg">🚀</span>
            <span>NEW GAME</span>
          </motion.button>

          <motion.button 
            className="w-full py-3 bg-purple-200 hover:bg-purple-300 text-black font-pixel rounded-lg pixel-button pixel-border"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            LEADERBOARD
          </motion.button>

          <motion.button 
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-black font-pixel rounded-lg pixel-button pixel-border"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            1-1 BATTLE
          </motion.button>
        </div>

        {/* High score section */}
        <div className="w-full bg-yellow-100 rounded-lg p-4 text-center">
          <p className="text-sm font-bold mb-2">HIGHEST SCORE</p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm">ALEX_SS</span>
            <span className="text-sm text-green-500">$487K</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">CAN YOU BEAT IT?</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-2 mt-8">
        <p className="text-xs text-gray-400">INSERT COIN TO CONTINUE</p>
        <p className="text-[10px] text-gray-300">A PRODUCTION BY MATT JAMES</p>
      </div>
    </main>
  );
}
