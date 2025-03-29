'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import PageTransition from '../../../../components/PageTransition';

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

  const handleComplete = () => {
    router.push('/');
  };

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
    <PageTransition>
      <main className="min-h-screen flex flex-col bg-white">
        {/* Header Section - Fixed at top */}
        <div className="w-full p-8 text-center space-y-4">
          <motion.div 
            className="flex justify-center items-center gap-4 text-sm mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center opacity-30 text-xs">✓</span>
            <div className="w-8 h-0.5 bg-black"></div>
            <span className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center opacity-30 text-xs">✓</span>
            <div className="w-8 h-0.5 bg-black"></div>
            <span className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center bg-yellow-300 text-xs">3</span>
          </motion.div>

          <motion.h2 
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            CREATE PROFILE
          </motion.h2>
          <motion.p
            className="text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Set up your trading profile
          </motion.p>
        </div>

        {/* Content Section - Scrollable */}
        <div className="flex-1 flex flex-col items-center p-4 overflow-y-auto">
          <div className="w-full max-w-sm">
            <motion.div 
              className="space-y-6 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
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
                        className="text-center p-2"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-xl">📸</span>
                        <div className="text-[10px] text-gray-500 mt-1">Click to upload</div>
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
                    className="w-full px-4 py-3 border-2 border-black rounded-none text-lg text-center transition-all duration-200 focus:border-yellow-300"
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
                className="w-full py-4 bg-gradient-to-r from-green-400 to-green-500 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold gap-2 transition-all duration-200 hover:from-green-500 hover:to-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
                onClick={handleComplete}
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
    </PageTransition>
  );
} 