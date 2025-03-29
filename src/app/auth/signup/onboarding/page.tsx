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
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md bg-gray-50 rounded-xl p-8 space-y-8 pixel-border">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              BACK
            </button>
            <div className="text-xs text-gray-500">
              LIVE PREVIEW
            </div>
          </div>
          <h1 className="text-xl font-bold text-center">
            BUILD YOUR PROFILE
          </h1>
        </div>

        {/* Profile Info */}
        <div className="space-y-6">
          {/* Profile Picture and Username */}
          <div className="flex gap-4">
            <label className="w-24 h-24 shrink-0 relative cursor-pointer rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors flex items-center justify-center bg-white">
              {profile.profilePicture ? (
                <Image
                  src={profile.profilePicture}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl">📷</span>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={profile.username}
                onChange={(e) => handleProfileChange('username', e.target.value)}
                className="w-full bg-transparent border-b-2 border-gray-200 focus:border-green-500 px-2 py-1 text-lg font-medium placeholder-gray-400 focus:outline-none"
                placeholder="TYPE IN USERNAME"
                maxLength={15}
              />
              <div className="text-sm text-gray-500">
                tradr.co/{profile.username || 'username'}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-600">BIO</label>
              <span className="text-xs text-gray-500">{profile.bio.length}/150</span>
            </div>
            <textarea
              value={profile.bio}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              className="w-full bg-white rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="What's your trading style?"
              rows={3}
              maxLength={150}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-gray-500">YOUR XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-gray-500">HIGHEST STREAK</div>
            </div>
          </div>
        </div>

        {/* Add Username Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/game')}
          className="w-full py-3 bg-green-200 hover:bg-green-300 text-black rounded-lg pixel-button flex items-center justify-center gap-2"
        >
          <span className="text-sm">ADD USERNAME</span>
        </motion.button>
      </div>
    </main>
  );
} 