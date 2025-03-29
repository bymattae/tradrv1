'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Nav Bar */}
      <div className="w-full border-b-2 border-black p-4">
        <h1 className="text-xl font-bold text-center">NAV BAR</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
        <motion.button
          className="w-full max-w-sm py-4 bg-white border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold"
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/auth/signup/email')}
        >
          I&apos;M NEW HERE
        </motion.button>

        <motion.button
          className="w-full max-w-sm py-4 bg-white border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold"
          whileTap={{ scale: 0.98 }}
        >
          I HAVE AN ACCOUNT
        </motion.button>
      </div>
    </main>
  );
} 