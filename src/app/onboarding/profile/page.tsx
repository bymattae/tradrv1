'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, X, Link as LinkIcon, Sparkles, AlertCircle, Copy, Lock, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

interface ProfileData {
  username: string;
  avatar: string | null;
  bio: string;
  tags: string[];
  theme: string;
  coverImage: string | null;
}

interface ChecklistItem {
  id: string;
  label: string;
  isComplete: boolean;
}

const THEMES = [
  { id: 'purple-haze', name: 'Purple Haze', gradient: 'from-purple-500/90 via-purple-600/90 to-indigo-500/90' },
  { id: 'blue-flame', name: 'Blue Flame', gradient: 'from-blue-500/90 via-blue-600/90 to-cyan-500/90' },
  { id: 'tokyo-neon', name: 'Tokyo Neon', gradient: 'from-pink-500/90 via-purple-500/90 to-indigo-500/90' },
  { id: 'soft-gold', name: 'Soft Gold', gradient: 'from-amber-200/90 via-amber-400/90 to-yellow-500/90' },
  { id: 'ghost', name: 'Ghost', gradient: 'from-gray-500/90 via-slate-600/90 to-zinc-700/90' },
];

export default function ProfileBuilder() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [editingField, setEditingField] = useState<'username' | 'bio' | 'tag' | null>(null);
  const [newTag, setNewTag] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [profileStrength, setProfileStrength] = useState(0);
  const [showCopied, setShowCopied] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    avatar: null,
    bio: '',
    tags: [],
    theme: THEMES[0].id,
    coverImage: null,
  });

  const checklist = useMemo(() => [
    { id: 'username', label: 'Choose username', isComplete: profileData.username.length >= 3 },
    { id: 'avatar', label: 'Upload avatar', isComplete: !!profileData.avatar },
    { id: 'bio', label: 'Add bio', isComplete: profileData.bio.length > 0 },
    { id: 'tags', label: 'Add tags', isComplete: profileData.tags.length > 0 },
    { id: 'theme', label: 'Pick theme', isComplete: !!profileData.theme },
  ], [profileData.username.length, profileData.avatar, profileData.bio.length, profileData.tags.length, profileData.theme]);

  const isValid = checklist.every(item => item.isComplete);

  useEffect(() => {
    // Calculate profile strength
    const completedItems = checklist.filter(item => item.isComplete).length;
    const strength = Math.round((completedItems / checklist.length) * 100);
    setProfileStrength(strength);

    // Trigger confetti when all items are complete
    if (strength === 100 && !isValid) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [profileData, checklist, isValid]);

  useEffect(() => {
    // Simulate username availability check
    if (profileData.username.length >= 3) {
      const timer = setTimeout(() => {
        setUsernameAvailable(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [profileData.username]);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`tradr.co/${profileData.username}`);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
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

        <div className="flex gap-8">
          {/* Checklist */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-48 space-y-6 pt-8"
          >
            {/* Level Badge */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Level 1 Trader</span>
              </div>
              {/* Progress Bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileStrength}%` }}
                  className={`h-full bg-gradient-to-r ${currentTheme}`}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Profile Strength: {profileStrength}%
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {checklist.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    item.isComplete ? 'bg-green-500' : 'bg-gray-200'
                  }`}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className={`text-sm ${
                    item.isComplete ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <div className="relative rounded-[2rem] shadow-xl overflow-hidden bg-white border border-gray-100">
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
                          className="text-2xl font-bold w-full bg-transparent outline-none border-b-2 border-purple-500 ml-1 text-center font-display"
                        />
                      </motion.div>
                    ) : (
                      <motion.button
                        onClick={() => setEditingField('username')}
                        className="group"
                      >
                        <span className="text-2xl font-bold text-gray-400">@</span>
                        <span className="text-2xl font-bold text-gray-900 font-display">
                          {profileData.username || 'username'}
                        </span>
                      </motion.button>
                    )}
                    {profileData.username && (
                      <AnimatePresence>
                        {usernameAvailable === true && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute -right-6 top-1/2 -translate-y-1/2"
                          >
                            <div className="flex items-center gap-1 text-green-500 text-sm">
                              <Check className="w-4 h-4" />
                            </div>
                          </motion.div>
                        )}
                        {usernameAvailable === false && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -bottom-6 left-0 right-0 text-red-500 text-sm"
                          >
                            Username taken
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                        placeholder="ex: ICT trader | funded | London"
                        className="w-full bg-transparent outline-none resize-none text-gray-600 text-center border-b-2 border-purple-500 font-medium"
                        rows={2}
                      />
                    ) : (
                      <motion.button
                        onClick={() => setEditingField('bio')}
                        className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                      >
                        {profileData.bio || 'Add a short bio'}
                      </motion.button>
                    )}
                  </div>

                  {/* Link Preview */}
                  <motion.button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-purple-500 transition-colors group mx-auto"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span className="font-mono">tradr.co/{profileData.username || 'username'}</span>
                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                  <AnimatePresence>
                    {showCopied && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs text-green-500"
                      >
                        Copied to clipboard!
                      </motion.div>
                    )}
                  </AnimatePresence>

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
            </div>

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

            {/* Info Block */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-4 rounded-2xl bg-gray-50 border border-gray-100"
            >
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Lock className="w-4 h-4" />
                <span className="font-medium">Your tradr page is almost ready</span>
              </div>
              <p className="text-sm text-gray-500">
                You&apos;ll be able to share this link with followers and post your verified trades.
              </p>
            </motion.div>

            {/* Continue Button */}
            <motion.div 
              className="mt-8"
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
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 