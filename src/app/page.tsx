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

const ComingSoonText = () => (
  <div className="scroll-text-container">
    <div className="scroll-text-content">
      <span>1-1 battles with your friends coming soon!</span>
      <span>1-1 battles with your friends coming soon!</span>
      <span>1-1 battles with your friends coming soon!</span>
    </div>
  </div>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-lg mx-auto pt-20">
        <div className="space-y-4">
          {/* New Game Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white hover:bg-gray-100 text-black font-bold py-6 rounded-xl flex items-center justify-center gap-3"
          >
            <span className="text-xl">NEW GAME</span>
          </motion.button>

          {/* 1-1 Battle Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#333] hover:bg-[#444] text-white py-4 rounded-xl flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-3">
              <span>1-1 BATTLE</span>
            </div>
            <div className="overflow-hidden w-full">
              <div className="scroll-text">
                <div className="scroll-text-content">
                  COMPETE AGAINST OTHER TRADERS IN REAL-TIME
                </div>
              </div>
            </div>
          </motion.button>

          {/* Leaderboard Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#333] hover:bg-[#444] text-white py-4 rounded-xl flex items-center justify-center gap-3"
          >
            <span>LEADERBOARD</span>
          </motion.button>
        </div>
      </div>
    </main>
  );
}
