'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Image
              src="/logo.png"
              alt="TRADR"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-[#A259FF] to-[#6B4EFF] bg-clip-text text-transparent font-display">
              TRADR
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link 
              href="/auth"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A259FF] to-[#6B4EFF] text-white font-medium hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <div className="mb-16">
            <Image
              src="/logo.png"
              alt="TRADR"
              width={80}
              height={80}
              className="w-20 h-20 mx-auto mb-8"
            />
            <h1 className="text-5xl font-bold font-display bg-gradient-to-r from-[#A259FF] via-[#6B4EFF] to-[#241654] bg-clip-text text-transparent mb-6">
              Trade with proof, not hype
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join the next generation of verified traders. Build your profile, share your strategies, and earn rewards.
            </p>
          </div>

          <Link
            href="/auth"
            className="inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r from-[#A259FF] to-[#6B4EFF] text-white font-medium text-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Start Trading
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="TRADR"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-sm text-gray-500">
              © 2024 TRADR. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
} 