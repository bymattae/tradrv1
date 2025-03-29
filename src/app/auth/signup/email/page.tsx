'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EmailSignupPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Header Section - Fixed at top */}
      <div className="w-full p-8 text-center space-y-4">
        <motion.h2 
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          JOIN THE GAME
        </motion.h2>
        <motion.p
          className="text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Start trading and compete with others
        </motion.p>
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 flex flex-col items-center p-4 overflow-y-auto">
        <div className="w-full max-w-sm space-y-6">
          {/* Email input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="email"
              className="w-full px-4 py-3 border-2 border-black rounded-none text-lg text-center transition-all duration-200 focus:border-yellow-300"
              placeholder="you@example.com"
              required
            />
          </motion.div>

          {/* Start button */}
          <motion.button
            className="w-full py-4 bg-yellow-300 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold gap-2 transition-all duration-200 hover:bg-yellow-400"
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => router.push('/auth/signup/onboarding')}
          >
            <span>START NOW</span>
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🚀
            </motion.span>
          </motion.button>

          {/* Divider */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-black"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-lg">OR</span>
            </div>
          </motion.div>

          {/* Social buttons */}
          <motion.div 
            className="grid grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              className="relative py-3 bg-white border-2 border-black rounded-none text-lg font-bold transition-all duration-200 hover:bg-gray-50"
              whileTap={{ scale: 0.98 }}
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={24}
                height={24}
                className="mx-auto"
              />
            </motion.button>
            <motion.button
              className="relative py-3 bg-black border-2 border-black rounded-none text-lg font-bold text-white transition-all duration-200 hover:bg-gray-900"
              whileTap={{ scale: 0.98 }}
            >
              <Image
                src="/apple.svg"
                alt="Apple"
                width={24}
                height={24}
                className="mx-auto"
              />
            </motion.button>
            <motion.button
              className="relative py-3 bg-[#1877F2] border-2 border-black rounded-none text-lg font-bold text-white transition-all duration-200 hover:bg-blue-600"
              whileTap={{ scale: 0.98 }}
            >
              <Image
                src="/facebook.svg"
                alt="Facebook"
                width={24}
                height={24}
                className="mx-auto"
              />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </main>
  );
} 