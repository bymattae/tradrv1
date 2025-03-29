'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-white">
      <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        {/* Logo section */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-xl sm:text-2xl mb-3 sm:mb-4"
          >
            📊
          </motion.div>
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold tracking-tight text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-green-500">BUY</span>
            {" "}or{" "}
            <span className="text-red-500">SELL</span>
          </motion.h1>
        </div>

        {/* Menu buttons */}
        <div className="w-full space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          <motion.button
            className="w-full py-4 sm:py-5 bg-green-200 hover:bg-green-300 text-black rounded-lg pixel-button pixel-border flex items-center justify-center text-base sm:text-lg relative shadow-lg"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/auth/signup/email')}
          >
            <div className="flex items-center justify-center gap-3">
              <motion.span 
                className="text-xl sm:text-2xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎮
              </motion.span>
              <span className="font-bold">I&apos;M NEW HERE</span>
            </div>
          </motion.button>

          <motion.button
            className="w-full py-3 sm:py-4 bg-purple-200 hover:bg-purple-300 text-black rounded-lg pixel-button pixel-border flex items-center justify-center"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-3">
              <motion.span 
                className="text-lg sm:text-xl"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🔑
              </motion.span>
              <span>I HAVE AN ACCOUNT</span>
            </div>
          </motion.button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <motion.p 
            className="text-xs text-gray-400 mb-1 sm:mb-2"
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
          <p className="text-[8px] sm:text-[10px] text-gray-300">A PRODUCTION BY MATT JAMES</p>
        </div>
      </div>
    </main>
  );
} 