'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function EmailSignupPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-lg mx-auto pt-20">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">GET STARTED</h1>
            <p className="text-gray-400">Enter your email to begin</p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-[#333] text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/auth/signup/onboarding')}
              className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3"
            >
              <span>CONTINUE</span>
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-400">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center px-4 py-3 bg-[#333] hover:bg-[#444] rounded-xl"
              >
                <span>🌐</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center px-4 py-3 bg-[#333] hover:bg-[#444] rounded-xl"
              >
                <span>👥</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center px-4 py-3 bg-[#333] hover:bg-[#444] rounded-xl"
              >
                <span>🍎</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 