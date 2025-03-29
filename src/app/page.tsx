'use client';

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#f8f9ff] to-[#f5f6ff] px-4 py-6">
      {/* Status Bar Area */}
      <div className="h-6" />

      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl mb-2 font-mono font-bold tracking-tight">
          <span className="text-[#00FF99]">TRADR</span>
        </h1>
        <p className="text-sm text-gray-600">Built by traders for traders 🚀</p>
      </motion.div>

      {/* Live Competition Card */}
      <motion.div 
        className="card mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-mono">Current Competition</h2>
          <span className="px-2 py-1 bg-[#00FF99]/10 text-[#00FF99] text-xs rounded-full">LIVE NOW</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00FF99] to-[#00CC7A] rounded-xl flex items-center justify-center text-xl">
            🏆
          </div>
          <div>
            <h3 className="font-mono font-bold">Daily Trading Cup</h3>
            <p className="text-sm text-gray-600">457/2000 Players</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono font-bold">$2,500 Prize Pool</span>
          <button className="button-primary text-sm">Join Now 🎮</button>
        </div>
      </motion.div>

      {/* Stats Card */}
      <motion.div 
        className="card mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-mono">Your Stats</h2>
          <span className="text-[#A66EFF] text-sm">View All →</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-black/5 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Win Rate</p>
            <p className="text-2xl font-mono font-bold text-[#00FF99]">76%</p>
          </div>
          <div className="p-4 bg-black/5 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Total Profit</p>
            <p className="text-2xl font-mono font-bold text-[#00FF99]">+$4.2K</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <button className="button-primary w-full">
          New Game 🎮
        </button>
        <button className="button-secondary w-full">
          1v1 Battle ⚔️
        </button>
      </motion.div>
    </main>
  );
} 