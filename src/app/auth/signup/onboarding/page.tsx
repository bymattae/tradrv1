'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function ProfileBuilderPage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    profilePicture: null as string | null,
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-white">
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        {/* Title outside the box */}
        <div className="text-center space-y-1 sm:space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">
            BUILD YOUR PROFILE
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">Make it yours! 🎨</p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-8 space-y-6 sm:space-y-8 pixel-border">
          {/* Profile Info */}
          <div className="space-y-6 sm:space-y-8">
            {/* Profile Picture and Username */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
              <label className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 relative cursor-pointer rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors flex items-center justify-center bg-white pixel-border">
                {profile.profilePicture ? (
                  <Image
                    src={profile.profilePicture}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-3xl sm:text-4xl block mb-1">📷</span>
                    <span className="text-xs text-gray-500">Upload Photo</span>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              <div className="flex-1 w-full sm:w-auto space-y-2 sm:space-y-3">
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => handleProfileChange('username', e.target.value)}
                  className="w-full bg-transparent border-b-2 border-gray-200 focus:border-green-500 px-2 py-1 text-lg sm:text-xl font-medium placeholder-gray-400 focus:outline-none text-center sm:text-left"
                  placeholder="TYPE IN USERNAME"
                  maxLength={15}
                />
                <div className="text-sm text-gray-500 flex items-center gap-2 justify-center sm:justify-start">
                  <span>🔗</span>
                  tradr.co/{profile.username || 'username'}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">BIO</label>
                <span className="text-xs text-gray-500">{profile.bio.length}/150</span>
              </div>
              <textarea
                value={profile.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                className="w-full bg-white rounded-xl p-3 sm:p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 pixel-border"
                placeholder="What's your trading style? 📈"
                rows={3}
                maxLength={150}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="text-center bg-white rounded-xl p-3 sm:p-4 pixel-border">
                <div className="text-xl sm:text-2xl font-bold">0</div>
                <div className="text-xs text-gray-500">YOUR XP</div>
              </div>
              <div className="text-center bg-white rounded-xl p-3 sm:p-4 pixel-border">
                <div className="text-xl sm:text-2xl font-bold">0</div>
                <div className="text-xs text-gray-500">HIGHEST STREAK</div>
              </div>
            </div>
          </div>

          {/* Save Profile Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/game')}
            className="w-full py-3 sm:py-4 bg-green-200 hover:bg-green-300 text-black rounded-xl pixel-button flex items-center justify-center gap-2 text-base sm:text-lg font-medium"
          >
            <span>✨</span>
            <span>SAVE PROFILE</span>
          </motion.button>
        </div>
      </div>
    </main>
  );
} 