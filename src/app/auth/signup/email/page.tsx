'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function EmailSignupPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Nav Bar */}
      <div className="w-full border-b-2 border-black p-4 pixel-border-bottom">
        <h1 className="text-xl font-bold text-center tracking-wide">TRADR</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
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
          <h2 className="text-2xl font-bold tracking-wide">ENTER YOUR EMAIL</h2>
        </div>
        
        <div className="w-full max-w-sm space-y-6">
          {/* Email input */}
          <input
            type="email"
            className="w-full px-4 py-3 bg-white text-black rounded-lg pixel-border text-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="you@example.com"
            required
          />

          {/* Start button */}
          <motion.button
            className="w-full py-4 bg-green-200 hover:bg-green-300 text-black rounded-lg pixel-button pixel-border flex items-center justify-center text-lg font-bold tracking-wide"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/auth/signup/onboarding')}
          >
            <div className="flex items-center justify-center gap-2">
              <motion.span 
                className="text-xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
              START NOW
            </div>
          </motion.button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-black"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-lg font-bold tracking-wide">OR</span>
            </div>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-3 gap-4">
            <motion.button
              className="py-3 bg-white text-black rounded-lg pixel-button pixel-border flex items-center justify-center text-base font-bold tracking-wide"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl">G</span>
            </motion.button>
            <motion.button
              className="py-3 bg-black text-white rounded-lg pixel-button pixel-border flex items-center justify-center text-base font-bold tracking-wide"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl">🍎</span>
            </motion.button>
            <motion.button
              className="py-3 bg-blue-600 text-white rounded-lg pixel-button pixel-border flex items-center justify-center text-base font-bold tracking-wide"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl">f</span>
            </motion.button>
          </div>
        </div>

        {/* Footer */}
        <motion.p 
          className="text-xs text-gray-400 mt-8"
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