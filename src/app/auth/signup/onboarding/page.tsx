'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [bio, setBio] = useState('');

  // Simulate username check - replace with actual API call
  useEffect(() => {
    if (username.length > 0) {
      const timer = setTimeout(() => {
        setIsUsernameAvailable(username.length > 3);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [username]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Header Section - Fixed at top */}
      <div className="w-full p-8 text-center space-y-4">
        <div className="flex justify-center items-center gap-4 text-sm">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center bg-yellow-300">1</span>
            <div className="w-12 h-0.5 bg-black"></div>
          </motion.div>
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center">2</span>
            <div className="w-12 h-0.5 bg-black"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center">3</span>
          </motion.div>
        </div>
        <motion.h2 
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          BUILD YOUR PROFILE
        </motion.h2>
        <motion.div 
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm">LIVE PREVIEW</span>
        </motion.div>
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 flex flex-col items-center p-4 overflow-y-auto">
        <div className="w-full max-w-sm">
          <motion.div 
            className="space-y-6 border-2 border-black p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Profile Picture */}
            <div className="flex justify-center">
              <label className="relative cursor-pointer group">
                <div className="w-24 h-24 border-2 border-black flex items-center justify-center overflow-hidden transition-all duration-200 group-hover:border-yellow-300">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  ) : (
                    <motion.div 
                      className="text-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-2xl">📸</span>
                      <br />
                      <span className="text-xs text-gray-500">Click to upload</span>
                    </motion.div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-black rounded-none text-lg text-center"
                  placeholder="@Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {username.length > 0 && (
                  <motion.div 
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {isUsernameAvailable ? '✅' : '❌'}
                  </motion.div>
                )}
              </div>
              <motion.p 
                className="text-sm text-center"
                animate={{ 
                  color: isUsernameAvailable ? '#059669' : '#DC2626'
                }}
              >
                tradr.co/@{username || 'username'}
              </motion.p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <textarea
                className="w-full p-4 border-2 border-black rounded-none text-lg resize-none transition-all duration-200 focus:border-yellow-300"
                placeholder="Write your bio ✍️"
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
              />
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">{bio.length}/160</span>
              </div>
            </div>

            {/* Complete Button */}
            <motion.button
              className="w-full py-4 bg-yellow-300 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold gap-2 transition-all duration-200 hover:bg-yellow-400"
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/')}
            >
              <span>COMPLETE</span>
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎮
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </main>
  );
} 