'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PageTransition from '@/app/components/PageTransition';

export default function OnboardingPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

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
            CREATE PROFILE
          </motion.h2>
          <motion.p
            className="text-base text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: 'monospace' }}
          >
            Set up your trading profile
          </motion.p>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col items-center px-4 pb-4">
          <div className="w-full max-w-sm space-y-6">
            {/* Profile Picture Upload */}
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-32 h-32 rounded-full border-2 border-black bg-gray-100 flex items-center justify-center overflow-hidden">
                <span className="text-4xl">📸</span>
              </div>
              <button className="text-sm text-gray-600 hover:text-gray-800">
                Upload Picture
              </button>
            </motion.div>

            {/* Username Input */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Choose username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setIsUsernameAvailable(e.target.value.length >= 3);
                  }}
                  className="w-full px-4 py-3 rounded-lg border-2 border-black focus:outline-none focus:border-yellow-500 transition-colors"
                />
                <span>{isUsernameAvailable ? '✅' : '❌'}</span>
              </div>
              <p className="text-sm text-gray-500">
                {isUsernameAvailable ? 'Username is available' : 'Username is too short'}
              </p>
            </motion.div>

            {/* Bio Input */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <textarea
                placeholder="Write a short bio..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                className="w-full h-32 px-4 py-3 rounded-lg border-2 border-black focus:outline-none focus:border-yellow-500 transition-colors resize-none"
              />
              <p className="text-sm text-gray-500 text-right">
                {bio.length}/160 characters
              </p>
            </motion.div>

            {/* Complete Button */}
            <motion.button
              className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Complete →
            </motion.button>
          </div>
        </div>
      </main>
    </PageTransition>
  );
} 