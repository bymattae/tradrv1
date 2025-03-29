'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function EmailSignupPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-white">
      <div className="w-full max-w-sm mx-auto space-y-8">
        {/* Logo section */}
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
            className="text-2xl mb-4"
          >
            📊
          </motion.div>
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-green-500">BUY</span>
            {" "}or{" "}
            <span className="text-red-500">SELL</span>
          </motion.h1>
        </div>

        {/* Email signup form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          <motion.button
            className="w-full py-5 bg-green-200 hover:bg-green-300 text-black rounded-lg pixel-button pixel-border flex items-center justify-center text-lg relative shadow-lg"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/auth/signup/onboarding')}
          >
            <div className="flex items-center justify-center gap-3">
              <motion.span 
                className="text-2xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✉️
              </motion.span>
              <span className="font-bold">START WITH EMAIL</span>
            </div>
          </motion.button>
        </div>

        {/* Social login options */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <motion.button
            className="w-full py-4 bg-white hover:bg-gray-50 text-gray-700 rounded-lg pixel-button pixel-border flex items-center justify-center border border-gray-300"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-xl">G</span>
              <span>Google</span>
            </div>
          </motion.button>

          <motion.button
            className="w-full py-4 bg-black hover:bg-gray-900 text-white rounded-lg pixel-button pixel-border flex items-center justify-center"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-xl">🍎</span>
              <span>Apple</span>
            </div>
          </motion.button>

          <motion.button
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg pixel-button pixel-border flex items-center justify-center"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-xl">f</span>
              <span>Facebook</span>
            </div>
          </motion.button>
        </div>

        {/* Back button */}
        <motion.button 
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg pixel-button pixel-border flex items-center justify-center mt-4"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/auth')}
        >
          <div className="flex items-center justify-center gap-3">
            <span>←</span>
            <span>GO BACK</span>
          </div>
        </motion.button>

        {/* Footer */}
        <div className="text-center space-y-2 mt-8">
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
      </div>
    </main>
  );
} 