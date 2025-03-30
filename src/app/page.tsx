'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          TRADR
        </h1>
        <div className="flex items-center gap-4">
          <Link 
            href="/auth"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Sign In
          </Link>
          <Link
            href="/auth"
            className="text-sm font-medium text-white bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <motion.main 
        className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to the Future of Trading
        </h2>
        <p className="text-gray-600 max-w-2xl mb-8">
          Join a community of traders who share verified results and proven strategies. No hype, just real performance.
        </p>
        <Link
          href="/auth"
          className="text-lg font-medium text-white bg-purple-600 px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
        >
          Start Your Journey
        </Link>
      </motion.main>

      {/* Footer */}
      <footer className="p-4 md:p-6 text-center text-sm text-gray-500">
        © 2024 TRADR. All rights reserved.
      </footer>
    </div>
  );
} 