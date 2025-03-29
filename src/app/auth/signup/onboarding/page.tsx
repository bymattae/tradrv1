'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col bg-white px-4">
      {/* Header Section */}
      <div className="pt-20 pb-4">
        <div className="max-w-md mx-auto text-center space-y-3">
          <h1 className="text-[32px] leading-tight tracking-wide">
            BUILD YOUR
            <br />
            PROFILE
          </h1>
          <p className="text-gray-400 text-sm tracking-wide">Make it yours! 🎨</p>
        </div>
      </div>

      {/* Live Preview Indicator */}
      <div className="max-w-md mx-auto w-full flex items-center justify-end gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span className="text-xs text-gray-400 tracking-wide">LIVE PREVIEW</span>
      </div>

      {/* Content Section */}
      <div className="flex-1 max-w-md mx-auto w-full">
        <div className="bg-white rounded-3xl p-6 space-y-8 pixel-border">
          {/* Profile Info */}
          <div className="space-y-8">
            {/* Profile Picture */}
            <div className="flex justify-center">
              <label className="w-28 h-28 relative cursor-pointer rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-green-500 transition-colors flex items-center justify-center bg-white pixel-border">
                <div className="text-center">
                  <span className="text-2xl block mb-1">📷</span>
                  <span className="text-[10px] text-gray-400">Upload Photo</span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">@</span>
                <input
                  type="text"
                  className="w-full bg-white rounded-xl px-10 py-3 text-lg placeholder-gray-300 focus:outline-none pixel-border text-center tracking-wide"
                  placeholder="username"
                  maxLength={15}
                />
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-2 justify-center tracking-wide">
                <span>🔗</span>
                tradr.co/username
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm text-gray-400 tracking-wide">BIO</label>
                <span className="text-xs text-gray-400">0/150</span>
              </div>
              <textarea
                className="w-full bg-white rounded-xl p-4 text-lg resize-none focus:outline-none pixel-border tracking-wide"
                placeholder="What's your trading style?"
                rows={3}
                maxLength={150}
              />
            </div>
          </div>

          {/* Continue Button */}
          <motion.button
            className="w-full py-4 bg-green-200 hover:bg-green-300 text-black rounded-lg pixel-button pixel-border flex items-center justify-center"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
          >
            <div className="flex items-center justify-center gap-3">
              <motion.span 
                className="text-xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
              <span>COMPLETE PROFILE</span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-2 mt-8 mb-4">
        <motion.p 
          className="text-xs text-gray-400"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          INSERT COIN TO CONTINUE
        </motion.p>
      </div>
    </main>
  );
} 