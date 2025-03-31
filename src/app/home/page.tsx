'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, LineChart, Trophy, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Tradr
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link 
                href="/auth/signup" 
                className="inline-flex items-center px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Your verified
              <br />
              trading profile
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Share your performance. Build your brand.
            </motion.p>

            <motion.div 
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-8 py-4 rounded-2xl bg-black text-white hover:bg-gray-800 transition-colors text-lg"
              >
                Get your Tradr profile
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Floating UI Elements */}
          <div className="relative mt-20">
            <motion.div 
              className="absolute -top-4 left-1/4 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-4 w-48">
                <div className="flex items-center space-x-2">
                  <LineChart className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Win Rate</span>
                </div>
                <div className="text-2xl font-bold mt-1">67.8%</div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute top-20 right-1/4 transform translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-4 w-48">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium">Performance</span>
                </div>
                <div className="text-2xl font-bold mt-1">+124.5%</div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-4 w-48">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">Followers</span>
                </div>
                <div className="text-2xl font-bold mt-1">2.4k</div>
              </div>
            </motion.div>

            {/* Center Profile Preview */}
            <motion.div 
              className="max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full" />
                  <div>
                    <div className="text-lg font-bold">@phantomtrader</div>
                    <div className="text-sm text-gray-500">Verified Trader</div>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="h-2 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-2 bg-gray-100 rounded-full w-1/2" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 