'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function EmailSignupPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Nav Bar */}
      <div className="w-full border-b border-black p-4">
        <h1 className="text-xl font-bold text-center">TRADR</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <h2 className="text-xl font-bold">ENTER YOUR EMAIL</h2>
        
        <div className="w-full max-w-sm space-y-6">
          {/* Email input */}
          <input
            type="email"
            className="w-full px-4 py-3 border-2 border-black rounded-none text-lg text-center"
            placeholder="you@example.com"
            required
          />

          {/* Start button */}
          <motion.button
            className="w-full py-4 bg-yellow-300 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold"
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/auth/signup/onboarding')}
          >
            START NOW
          </motion.button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-black"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-lg">OR</span>
            </div>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-3 gap-4">
            <motion.button
              className="py-3 bg-white border-2 border-black rounded-none text-lg font-bold"
              whileTap={{ scale: 0.98 }}
            >
              Google
            </motion.button>
            <motion.button
              className="py-3 bg-white border-2 border-black rounded-none text-lg font-bold"
              whileTap={{ scale: 0.98 }}
            >
              Apple
            </motion.button>
            <motion.button
              className="py-3 bg-white border-2 border-black rounded-none text-lg font-bold"
              whileTap={{ scale: 0.98 }}
            >
              Facebook
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  );
} 