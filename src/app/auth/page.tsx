'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PageTransition from '@/app/components/PageTransition';

export default function AuthPage() {
  const router = useRouter();

  const handleEmailSignup = () => {
    router.push('/auth/signup/email');
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col bg-white">
        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 gap-8">
          <div className="w-full p-8 text-center space-y-4">
            <motion.div 
              className="flex justify-center items-center gap-4 text-sm mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center bg-yellow-300 text-xs">1</span>
              <div className="w-8 h-0.5 bg-black opacity-30"></div>
              <span className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center opacity-30 text-xs">2</span>
              <div className="w-8 h-0.5 bg-black opacity-30"></div>
              <span className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center opacity-30 text-xs">3</span>
            </motion.div>

            <motion.h2 
              className="text-4xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontFamily: 'monospace' }}
            >
              WELCOME
            </motion.h2>
            <motion.p
              className="text-base text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ fontFamily: 'monospace' }}
            >
              Choose how to get started
            </motion.p>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <motion.button
              className="w-full max-w-sm py-4 bg-gradient-to-r from-green-400 to-green-500 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold gap-2 transition-all duration-200 hover:from-green-500 hover:to-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleEmailSignup}
            >
              <span>I&apos;M NEW HERE</span>
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎮
              </motion.span>
            </motion.button>

            <motion.button
              className="w-full max-w-sm py-4 bg-gradient-to-r from-blue-400 to-blue-500 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold gap-2 transition-all duration-200 hover:from-blue-500 hover:to-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span>I HAVE AN ACCOUNT</span>
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🔑
              </motion.span>
            </motion.button>
          </div>
        </div>
      </main>
    </PageTransition>
  );
} 