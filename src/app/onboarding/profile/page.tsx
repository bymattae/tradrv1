'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, X, Edit2, AlertCircle, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-lg border-b border-gray-100">
        <Link href="/auth/verify" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm font-medium text-gray-600"
        >
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>Building your profile</span>
        </motion.div>
        <div className="w-6" />
      </nav>

      <main className="max-w-xl mx-auto p-6">
        {/* Guidance Text */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your trading profile
          </h1>
          <p className="text-gray-600">
            This is how other traders will see you on tradr.co/{profileData.username || 'username'}
          </p>
        </motion.div>

        {/* Live Profile Card Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500 relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.2),_rgba(255,255,255,0))]"
            />
          </div>
          
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
                  <motion.div
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={profileData.avatar}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Camera className="w-8 h-8" />
                    <span className="text-xs font-medium">Add photo</span>
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
              {/* Username with @ symbol */}
              <div className="relative group">
                {isEditing === 'username' ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center"
                  >
                    <span className="text-2xl font-bold text-gray-400">@</span>
                    <input
                      autoFocus
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                      onBlur={() => setIsEditing(null)}
                      placeholder="username"
                      className="text-2xl font-bold w-full bg-transparent outline-none border-b-2 border-purple-500 ml-1"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    onClick={() => setIsEditing('username')}
                    className="flex items-center gap-2 cursor-text group"
                  >
                    <span className="text-2xl font-bold text-gray-400">@</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {profileData.username || 'username'}
                    </span>
                    <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: profileData.username ? 1 : 0 }}
                  className="absolute -top-6 left-0 text-xs font-medium text-gray-500"
                >
                  Your unique username
                </motion.div>
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
                    placeholder="Describe your trading style in a few words..."
                    className="w-full bg-transparent outline-none resize-none text-gray-600 border-b-2 border-purple-500"
                    rows={2}
                  />
                ) : (
                  <motion.div
                    onClick={() => setIsEditing('bio')}
                    className="flex items-start gap-2 cursor-text min-h-[3rem]"
                  >
                    <span className="text-gray-600">
                      {profileData.bio || 'Add a short bio'}
                    </span>
                    <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: profileData.bio ? 1 : 0 }}
                  className="absolute -top-6 left-0 text-xs font-medium text-gray-500"
                >
                  Your trading bio
                </motion.div>
              </div>

              {/* Tags */}
              <div className="space-y-3 pt-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-medium text-gray-500"
                >
                  {profileData.tags.length === 5 ? 
                    'Maximum tags selected' : 
                    `Select up to ${5 - profileData.tags.length} more tags`
                  }
                </motion.div>
                
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
                        className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-medium flex items-center gap-1.5 group hover:bg-purple-100 transition-colors"
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
                          className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
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
        <motion.div 
          className="mt-8 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
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