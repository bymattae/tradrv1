'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Trophy, Swords, Star, DollarSign, Users } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Top Navigation Bar - Robinhood Style */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl tracking-tight"
          >
            TRADR
          </motion.h1>
          <div className="flex items-center gap-4">
            <motion.div 
              className="live-badge flex items-center gap-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </motion.div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Hero Section */}
        <motion.div 
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl">Trade Like a Pro 🏎️</h2>
          <p className="text-gray-600">Race to the top of the leaderboard!</p>
        </motion.div>

        {/* Live Competition Card - Mario Kart Style */}
        <motion.div 
          className="mario-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FFB800]" />
              <h3 className="text-sm">Current Race</h3>
            </div>
            <div className="prize-badge flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>10,000</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Players</p>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#16C784]" />
                <span className="stats-value">128</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Time Left</p>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#FFB800]" />
                <span className="stats-value">2:30</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button 
            className="button-primary flex items-center justify-center gap-2 shine-effect"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TrendingUp className="w-5 h-5" />
            New Game
          </motion.button>
          
          <motion.button 
            className="button-secondary flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Swords className="w-5 h-5" />
            1v1 Battle
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <motion.div 
            className="mario-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-sm mb-4">Your Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Win Rate</p>
                <div className="stats-value">76%</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Profit</p>
                <div className="stats-value text-[#16C784]">$2,450</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="mario-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-sm mb-4">Leaderboard Position</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Global Rank</p>
                <div className="stats-value">#42</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weekly Points</p>
                <div className="stats-value text-[#FFB800]">850</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
} 