'use client';

import { motion } from 'framer-motion';

const CandlestickIcon = () => (
  <motion.div
    animate={{
      y: [0, -5, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="text-2xl mb-4"
  >
    📊
  </motion.div>
);

const pulseAnimation = {
  scale: [1, 1.02, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-white relative">
      {/* Language selector */}
      <div className="absolute top-4 right-4">
        <button className="text-gray-600 text-xs">English ▾</button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto space-y-12">
        {/* Logo section */}
        <div className="text-center">
          <CandlestickIcon />
          <motion.h1 
            className="game-title text-4xl font-bold tracking-tight text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-green-500">BUY</span>
            {" "}or{" "}
            <span className="text-red-500">SELL</span>
          </motion.h1>
          <p className="text-xs text-gray-500 italic">a game by matt james</p>
        </div>

        {/* Menu buttons */}
        <div className="w-full space-y-6">
          <motion.button 
            className="w-full py-5 bg-green-200 hover:bg-green-300 text-black rounded-lg pixel-button pixel-border flex items-center justify-center text-lg relative shadow-lg"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            animate={pulseAnimation}
          >
            <div className="flex items-center justify-center gap-3">
              <motion.span 
                className="text-2xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎮
              </motion.span>
              <span className="font-bold">NEW GAME</span>
            </div>
          </motion.button>

          <motion.button 
            className="w-full py-4 bg-purple-200 hover:bg-purple-300 text-black rounded-lg pixel-button pixel-border flex items-center justify-center"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-3">
              <motion.span 
                className="text-xl"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🏆
              </motion.span>
              <span>LEADERBOARD</span>
            </div>
          </motion.button>

          <motion.button 
            className="w-full py-4 bg-gray-200 text-gray-500 rounded-lg pixel-button pixel-border flex flex-col items-center justify-center cursor-not-allowed"
            whileHover={{ scale: 1 }}
          >
            <div className="flex items-center justify-center gap-3">
              <motion.span 
                className="text-xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                ⚔️
              </motion.span>
              <span>1-1 BATTLE</span>
            </div>
            <div className="scroll-text-container mt-1">
              <div className="scroll-text text-[10px] text-gray-500">
                1-1 battles with your friends coming soon!
              </div>
            </div>
          </motion.button>
        </div>

        {/* High score section */}
        <motion.div 
          className="w-full bg-yellow-100 rounded-lg p-6 text-center transform hover:scale-105 transition-transform"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="border-b-2 border-yellow-200 pb-2 mb-3">
            <p className="text-sm font-bold text-yellow-800">🌟 HIGHEST SCORE 🌟</p>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">👑</span>
              <span className="text-sm">ALEX_SS</span>
            </div>
            <span className="text-lg font-bold text-green-500">$487K</span>
          </div>
          <p className="text-xs text-yellow-700 mt-3 font-bold">CAN YOU BEAT IT?</p>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-2 mt-16 mb-4">
        <motion.p 
          className="text-xs text-gray-400"
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
        <p className="text-[10px] text-gray-300">A PRODUCTION BY MATT JAMES</p>
      </div>
    </main>
  );
}
