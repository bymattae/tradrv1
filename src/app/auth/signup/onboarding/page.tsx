'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function ProfileBuilderPage() {
  const router = useRouter();
  const [previewMode, setPreviewMode] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    tradrLink: '',
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
    <main className="flex min-h-screen flex-col items-center p-8 bg-white">
      {/* Header */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 pixel-button"
          >
            ← BACK
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg text-sm ${
              previewMode ? 'bg-gray-200' : 'bg-green-200'
            } pixel-button`}
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

      <div className="w-full max-w-2xl grid grid-cols-2 gap-8">
        {/* Edit Form */}
        <div className={`space-y-6 ${previewMode ? 'hidden' : ''}`}>
          {/* Profile Picture Upload */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">📸</span>
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
            </div>
            <div className="flex items-center justify-center w-full">
              <label className="w-32 h-32 relative cursor-pointer rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors">
                {profile.profilePicture ? (
                  <Image
                    src={profile.profilePicture}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <span className="text-3xl mb-2">📷</span>
                    <span className="text-xs text-center">Click to upload</span>
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
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">👤</span>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Choose your username
              </label>
            </div>
            <input
              type="text"
              id="username"
              value={profile.username}
              onChange={(e) => handleProfileChange('username', e.target.value)}
              className="pixel-input w-full px-4 py-3 rounded-lg"
              placeholder="TRADER_123"
              maxLength={15}
              required
            />
            <div className="flex justify-end">
              <span className="text-xs text-gray-500">{profile.username.length}/15</span>
            </div>
          </div>

          {/* Tradr.co Link */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔗</span>
              <label htmlFor="tradrLink" className="block text-sm font-medium text-gray-700">
                Your tradr.co link
              </label>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 px-3 py-2 bg-gray-50 rounded-l-lg border border-r-0 border-gray-300">
                tradr.co/
              </span>
              <input
                type="text"
                id="tradrLink"
                value={profile.tradrLink}
                onChange={(e) => handleProfileChange('tradrLink', e.target.value)}
                className="pixel-input flex-1 px-4 py-3 rounded-r-lg"
                placeholder="yourname"
                maxLength={30}
              />
            </div>
          </div>

          {/* Bio Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Your bio
              </label>
            </div>
            <textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              className="pixel-input w-full px-4 py-3 rounded-lg resize-none"
              placeholder="Tell us about your trading style..."
              rows={3}
              maxLength={150}
            />
            <div className="flex justify-end">
              <span className="text-xs text-gray-500">{profile.bio.length}/150</span>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className={`${previewMode ? 'col-span-2' : ''} profile-preview rounded-xl p-6 space-y-6`}>
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 relative">
              {profile.profilePicture ? (
                <Image
                  src={profile.profilePicture}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-3xl">
                  👤
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {profile.username || 'TRADER_123'}
              </h2>
              <p className="text-sm text-gray-500">
                tradr.co/{profile.tradrLink || 'yourname'}
              </p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-700">
            {profile.bio || 'Your trading style description will appear here...'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="stats-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">0</div>
              <div className="text-xs text-gray-500">XP</div>
            </div>
            <div className="stats-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">0</div>
              <div className="text-xs text-gray-500">WINS</div>
            </div>
            <div className="stats-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">$0</div>
              <div className="text-xs text-gray-500">HIGHEST SCORE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push('/game')}
        className="w-full max-w-2xl mt-8 py-4 bg-green-200 hover:bg-green-300 text-black rounded-lg pixel-button pixel-border flex items-center justify-center gap-2"
      >
        <span className="text-xl">✨</span>
        <span>SAVE PROFILE</span>
      </motion.button>
    </main>
  );
} 