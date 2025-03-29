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
                {profile.profilePicture ? (
                  <Image
                    src={profile.profilePicture}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-2xl block mb-1">📷</span>
                    <span className="text-[10px] text-gray-400">Upload Photo</span>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">@</span>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => handleProfileChange('username', e.target.value)}
                  className="w-full bg-white rounded-xl px-10 py-3 text-lg placeholder-gray-300 focus:outline-none pixel-border text-center tracking-wide"
                  placeholder="username"
                  maxLength={15}
                />
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-2 justify-center tracking-wide">
                <span>🔗</span>
                tradr.co/{profile.username || 'username'}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm text-gray-400 tracking-wide">BIO</label>
                <span className="text-xs text-gray-400">{profile.bio.length}/150</span>
              </div>
              <textarea
                value={profile.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                className="w-full bg-white rounded-xl p-4 text-lg resize-none focus:outline-none pixel-border tracking-wide"
                placeholder="What's your trading style?"
                rows={3}
                maxLength={150}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 