'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PageTransition from '@/app/components/PageTransition';

export default function EmailSignupPage() {
  const router = useRouter();

  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col bg-white">
        {/* Header Section */}
        <div className="w-full p-8 text-center space-y-4">
          <motion.h2 
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'monospace' }}
          >
            JOIN TRADR
          </motion.h2>
          <motion.p
            className="text-base text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: 'monospace' }}
          >
            Choose how to sign up
          </motion.p>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col items-center px-4 pb-4">
          <div className="w-full max-w-sm space-y-6">
            {/* Email input */}
            <div className="space-y-4">
              <motion.input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border-2 border-black focus:outline-none focus:border-yellow-500 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              />
              <motion.input
                type="password"
                placeholder="Choose a password"
                className="w-full px-4 py-3 rounded-lg border-2 border-black focus:outline-none focus:border-yellow-500 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              />
            </div>

            {/* Social Login Options */}
            <div className="space-y-4">
              <motion.button
                className="w-full px-6 py-3 bg-white border-2 border-black rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => {}}
              >
                🔍 Continue with Google
              </motion.button>
              <motion.button
                className="w-full px-6 py-3 bg-white border-2 border-black rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => {}}
              >
                🍎 Continue with Apple
              </motion.button>
              <motion.button
                className="w-full px-6 py-3 bg-white border-2 border-black rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => {}}
              >
                👥 Continue with Facebook
              </motion.button>
            </div>

            {/* Continue Button */}
            <motion.button
              className="w-full px-6 py-3 bg-yellow-400 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={() => router.push('/auth/signup/onboarding')}
            >
              Continue →
            </motion.button>
          </div>
        </div>
      </main>
    </PageTransition>
  );
} 