'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, X, Link as LinkIcon, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProfileData {
  username: string;
  avatar: string | null;
  bio: string;
  tags: string[];
  theme: string;
  coverImage: string | null;
}

const THEMES = [
  { id: 'purple-haze', name: 'Purple Haze', gradient: 'from-purple-500 via-purple-600 to-indigo-500' },
  { id: 'blue-flame', name: 'Blue Flame', gradient: 'from-blue-500 via-blue-600 to-cyan-500' },
  { id: 'tokyo-neon', name: 'Tokyo Neon', gradient: 'from-pink-500 via-purple-500 to-indigo-500' },
  { id: 'soft-gold', name: 'Soft Gold', gradient: 'from-amber-200 via-amber-400 to-yellow-500' },
  { id: 'ghost', name: 'Ghost', gradient: 'from-gray-500 via-slate-600 to-zinc-700' },
];

export default function ProfileBuilder() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [editingField, setEditingField] = useState<'username' | 'bio' | 'tag' | null>(null);
  const [newTag, setNewTag] = useState('');
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    avatar: null,
    bio: '',
    tags: [],
    theme: THEMES[0].id,
    coverImage: null,
  });
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(
      profileData.username.length >= 3 &&
      profileData.bio.length > 0 &&
      profileData.tags.length > 0
    );
  }, [profileData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ 
          ...profileData, 
          [type === 'avatar' ? 'avatar' : 'coverImage']: reader.result as string 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (newTag && profileData.tags.length < 5) {
      const emoji = '📈'; // In a real app, you'd have emoji suggestions
      const formattedTag = `${emoji} ${newTag.toLowerCase()}`;
      setProfileData({
        ...profileData,
        tags: [...profileData.tags, formattedTag]
      });
      setNewTag('');
      setEditingField(null);
    }
  };

  const handleContinue = () => {
    if (isValid) {
      localStorage.setItem('profileData', JSON.stringify(profileData));
      router.push('/onboarding/strategy');
    }
  };

  const currentTheme = THEMES.find(t => t.id === profileData.theme)?.gradient || THEMES[0].gradient;

  return (
    <div className="min-h-screen bg-gray-50/50">
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your trading profile
          </h1>
          <p className="text-gray-600">
            This is how other traders will see you on tradr.co/{profileData.username || 'username'}
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[2rem] shadow-xl overflow-hidden bg-white border border-gray-100"
        >
          {/* Cover Image / Gradient Area */}
          <div className={`h-32 bg-gradient-to-r ${currentTheme} relative overflow-hidden`}>
            {profileData.coverImage && (
              <Image
                src={profileData.coverImage}
                alt="Cover"
                fill
                className="object-cover opacity-60 mix-blend-overlay"
              />
            )}
            <motion.div
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.2),_rgba(255,255,255,0))]"
            />
            <button 
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-black/20 hover:bg-black/30 text-white rounded-full p-2"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'cover')}
              className="hidden"
            />
          </div>

          {/* Profile Content */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="relative w-32 h-32 rounded-full bg-gray-50 border-4 border-white shadow-lg overflow-hidden group"
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
                onChange={(e) => handleImageUpload(e, 'avatar')}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="pt-20 space-y-4 text-center">
              {/* Username */}
              <div className="relative inline-block">
                {editingField === 'username' ? (
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
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                      placeholder="username"
                      className="text-2xl font-bold w-full bg-transparent outline-none border-b-2 border-purple-500 ml-1 text-center"
                    />
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => setEditingField('username')}
                    className="group"
                  >
                    <span className="text-2xl font-bold text-gray-400">@</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {profileData.username || 'username'}
                    </span>
                  </motion.button>
                )}
              </div>

              {/* Bio */}
              <div className="relative max-w-sm mx-auto">
                {editingField === 'bio' ? (
                  <motion.textarea
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    autoFocus
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    onBlur={() => setEditingField(null)}
                    placeholder="Describe your trading style..."
                    className="w-full bg-transparent outline-none resize-none text-gray-600 text-center border-b-2 border-purple-500"
                    rows={2}
                  />
                ) : (
                  <motion.button
                    onClick={() => setEditingField('bio')}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {profileData.bio || 'Add a short bio'}
                  </motion.button>
                )}
              </div>

              {/* Link Preview */}
              <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500">
                <LinkIcon className="w-4 h-4" />
                <span>tradr.co/{profileData.username || 'username'}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <AnimatePresence>
                  {profileData.tags.map((tag) => (
                    <motion.button
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setProfileData({
                        ...profileData,
                        tags: profileData.tags.filter(t => t !== tag)
                      })}
                      className="px-3 py-1.5 rounded-full bg-white/90 shadow-sm border border-gray-100 text-gray-700 text-sm font-medium flex items-center gap-1.5 group hover:bg-gray-50 transition-all"
                    >
                      {tag}
                      <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </AnimatePresence>
                
                {profileData.tags.length < 5 && editingField !== 'tag' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingField('tag')}
                    className="px-3 py-1.5 rounded-full border border-dashed border-gray-200 text-gray-400 text-sm font-medium hover:border-gray-300 hover:text-gray-500 transition-colors"
                  >
                    + Add tag
                  </motion.button>
                )}

                {editingField === 'tag' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <input
                      autoFocus
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onBlur={handleAddTag}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Enter tag..."
                      className="px-3 py-1.5 rounded-full border border-purple-200 text-sm font-medium focus:outline-none focus:border-purple-500"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Theme Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-4"
        >
          <div className="text-center text-sm text-gray-500 mb-4">
            Choose your profile theme
          </div>
          <div className="flex justify-center gap-3">
            {THEMES.map((theme) => (
              <motion.button
                key={theme.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileData({ ...profileData, theme: theme.id })}
                className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${theme.gradient} ${
                  profileData.theme === theme.id 
                    ? 'ring-2 ring-purple-500 ring-offset-2' 
                    : 'ring-1 ring-white/20'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div 
          className="mt-8 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleContinue}
            disabled={!isValid}
            className={`w-full py-4 rounded-2xl font-medium text-lg transition-all duration-200 flex items-center justify-center gap-2
              ${isValid 
                ? `bg-gradient-to-r ${currentTheme} text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]` 
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