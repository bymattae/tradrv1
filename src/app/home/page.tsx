'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, LineChart, Trophy, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black">
                Tradr
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-600 hover:text-black">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-black">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-black">
                About
              </Link>
              <Link 
                href="/auth/signup" 
                className="inline-flex items-center px-4 py-2 bg-[#00FF7F] text-black font-medium hover:bg-[#00FF7F]/90 transition-colors rounded-lg"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-black tracking-tight"
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
                className="inline-flex items-center px-8 py-4 bg-[#00FF7F] text-black font-medium hover:bg-[#00FF7F]/90 transition-colors text-lg rounded-lg"
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
              <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-4 w-48">
                <div className="flex items-center space-x-2">
                  <LineChart className="w-5 h-5 text-[#00FF7F]" />
                  <span className="text-sm font-medium text-black">Win Rate</span>
                </div>
                <div className="text-2xl font-bold mt-1 text-black">67.8%</div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute top-20 right-1/4 transform translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-4 w-48">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-[#00FF7F]" />
                  <span className="text-sm font-medium text-black">Performance</span>
                </div>
                <div className="text-2xl font-bold mt-1 text-black">+124.5%</div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-4 w-48">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-[#00FF7F]" />
                  <span className="text-sm font-medium text-black">Followers</span>
                </div>
                <div className="text-2xl font-bold mt-1 text-black">2.4k</div>
              </div>
            </motion.div>

            {/* Center Profile Preview */}
            <motion.div 
              className="max-w-sm mx-auto bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#00FF7F] rounded-lg" />
                  <div>
                    <div className="text-lg font-bold text-black">@phantomtrader</div>
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

      {/* Proof Over Promises Section */}
      <section className="relative py-24 bg-black text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Real traders.
                <br />
                Real stats.
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Every profile is powered by real trading data—no fluff. Connect your trading account and let your performance speak for itself.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-6 py-3 bg-[#00FF7F] text-black font-medium hover:bg-[#00FF7F]/90 transition-colors rounded-lg"
              >
                Get your Tradr profile
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>

            {/* Mobile Preview */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-lg p-8 border border-white/10">
                <div className="bg-white/10 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#00FF7F] rounded-lg" />
                      <div className="text-lg font-bold">@sarahtrader</div>
                    </div>
                    <div className="px-3 py-1 bg-[#00FF7F] text-black text-sm font-medium rounded-lg">
                      Verified
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">86%</div>
                      <div className="text-sm text-gray-400">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">+235%</div>
                      <div className="text-sm text-gray-400">Return</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">4.2k</div>
                      <div className="text-sm text-gray-400">Followers</div>
                    </div>
                  </div>
                  <div className="h-32 bg-white/5 rounded-lg" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social-Ready Design Section */}
      <section className="relative py-24 bg-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-6">
              Built for social sharing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your profile is designed to look great everywhere—from Twitter to LinkedIn.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Customizable Themes */}
            <motion.div
              className="bg-white border border-gray-100 rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-[#00FF7F] rounded-lg mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-black rounded-sm" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                Customizable themes
              </h3>
              <p className="text-gray-600">
                Choose from beautiful themes or create your own to match your brand.
              </p>
            </motion.div>

            {/* Share to Socials */}
            <motion.div
              className="bg-white border border-gray-100 rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-[#00FF7F] rounded-lg mb-4 flex items-center justify-center">
                <Users className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                Share to socials
              </h3>
              <p className="text-gray-600">
                One-click sharing to all major social platforms with beautiful previews.
              </p>
            </motion.div>

            {/* Instant Verification */}
            <motion.div
              className="bg-white border border-gray-100 rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-[#00FF7F] rounded-lg mb-4 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                Instant verification
              </h3>
              <p className="text-gray-600">
                Connect your trading account and get verified status immediately.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 