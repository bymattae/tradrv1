'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProfileBuilderPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-white">
      {/* Header */}
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            BACK
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg text-sm ${
              previewMode ? 'bg-gray-200' : 'bg-green-200'
            }`}
          >
            {previewMode ? 'EDIT MODE' : 'PREVIEW MODE'}
          </motion.button>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-center mb-8"
        >
          BUILD YOUR PROFILE
        </motion.h1>
      </div>

      {/* Profile Builder */}
      <div className="w-full max-w-lg space-y-8">
        {/* Username Input */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              What&apos;s your trading style?
            </label>
          </div>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="TRADER_123"
            maxLength={15}
            required
          />
          <div className="flex justify-end">
            <span className="text-xs text-gray-500">{username.length}/15</span>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">📈</span>
              <span className="text-sm font-medium">YOUR STATS</span>
            </div>
            <span className="text-xs text-gray-500">0/150</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">0</div>
              <div className="text-xs text-gray-500">WINS</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">0</div>
              <div className="text-xs text-gray-500">HIGHEST STREAK</div>
            </div>
          </div>
        </div>

        {/* Add Username Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/game')}
          className="w-full py-4 bg-green-200 hover:bg-green-300 text-black rounded-lg pixel-button pixel-border flex items-center justify-center gap-2"
        >
          <span className="text-xl">✨</span>
          <span>ADD USERNAME</span>
        </motion.button>
      </div>
    </main>
  );
} 