'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, X, Edit2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProfileData {
  username: string;
  avatar: string | null;
  bio: string;
  tags: string[];
}

const SUGGESTED_TAGS = [
  '📈 technical', '💫 price action', '🌊 wave theory', '🎯 scalping',
  '🕊 swing', '📊 fundamental', '🔄 day trading', '💎 hodl',
  '🚀 momentum', '🎭 contrarian', '🌟 breakout', '🎪 futures'
];

export default function ProfileBuilder() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState<'username' | 'bio' | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    avatar: null,
    bio: '',
    tags: [],
  });
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Validate profile data
    setIsValid(
      profileData.username.length >= 3 &&
      profileData.bio.length > 0 &&
      profileData.tags.length > 0
    );
  }, [profileData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (profileData.tags.includes(tag)) {
      setProfileData({
        ...profileData,
        tags: profileData.tags.filter(t => t !== tag)
      });
    } else if (profileData.tags.length < 5) {
      setProfileData({
        ...profileData,
        tags: [...profileData.tags, tag]
      });
    }
  };

  const handleContinue = () => {
    if (isValid) {
      localStorage.setItem('profileData', JSON.stringify(profileData));
      router.push('/onboarding/strategy');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-lg border-b border-gray-100">
        <Link href="/auth/verify" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-medium text-gray-600"
        >
          Building your profile
        </motion.div>
        <div className="w-6" /> {/* Spacer for alignment */}
      </nav>

      <main className="max-w-xl mx-auto p-6 space-y-8">
        {/* Live Profile Card Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500" />
          
          {/* Profile Content */}
          <div className="relative px-6 pb-6">
            {/* Avatar Upload */}
            <div className="absolute -top-16 left-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="relative w-32 h-32 rounded-2xl bg-gray-50 border-4 border-white shadow-lg overflow-hidden group"
              >
                {profileData.avatar ? (
                  <Image
                    src={profileData.avatar}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </motion.button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Username & Bio */}
            <div className="pt-20 space-y-4">
              {/* Username */}
              <div className="relative group">
                {isEditing === 'username' ? (
                  <motion.input
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    autoFocus
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    onBlur={() => setIsEditing(null)}
                    placeholder="Your username"
                    className="text-2xl font-bold w-full bg-transparent outline-none border-b-2 border-purple-500"
                  />
                ) : (
                  <motion.div
                    onClick={() => setIsEditing('username')}
                    className="flex items-center gap-2 cursor-text"
                  >
                    <span className="text-2xl font-bold">
                      {profileData.username || 'Add username'}
                    </span>
                    <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                )}
              </div>

              {/* Bio */}
              <div className="relative group">
                {isEditing === 'bio' ? (
                  <motion.textarea
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    autoFocus
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    onBlur={() => setIsEditing(null)}
                    placeholder="Write a short bio..."
                    className="w-full bg-transparent outline-none resize-none text-gray-600"
                    rows={2}
                  />
                ) : (
                  <motion.div
                    onClick={() => setIsEditing('bio')}
                    className="flex items-start gap-2 cursor-text"
                  >
                    <span className="text-gray-600">
                      {profileData.bio || 'Add a short bio'}
                    </span>
                    <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {profileData.tags.map((tag) => (
                      <motion.button
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTagToggle(tag)}
                        className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium flex items-center gap-1 group"
                      >
                        {tag}
                        <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
                
                {profileData.tags.length < 5 && (
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TAGS
                      .filter(tag => !profileData.tags.includes(tag))
                      .map((tag) => (
                        <motion.button
                          key={tag}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleTagToggle(tag)}
                          className="px-3 py-1 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          {tag}
                        </motion.button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div className="space-y-4">
          <button
            onClick={handleContinue}
            disabled={!isValid}
            className={`w-full py-4 rounded-2xl font-medium text-lg transition-all duration-200 flex items-center justify-center gap-2
              ${isValid 
                ? 'bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]' 
                : 'bg-gray-100 text-gray-400'}`}
          >
            <span>Continue</span>
            {isValid && <Check className="w-5 h-5" />}
          </button>

          {!isValid && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-amber-600"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Complete your profile to continue</span>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
} 