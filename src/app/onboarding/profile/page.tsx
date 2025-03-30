'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, X, Link as LinkIcon, Sparkles, Lock, Shield, Copy, Trophy, Star } from 'lucide-react';
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
  xp: number;
}

interface ChecklistItem {
  id: string;
  label: string;
  isComplete: boolean;
  xpReward: number;
}

const THEMES = [
  { 
    id: 'cyber-purple',
    name: 'Cyber Purple',
    gradient: 'from-[#A259FF] via-[#6B4EFF] to-[#241654]',
    previewGradient: 'from-[#A259FF]/90 via-[#6B4EFF]/90 to-[#241654]/90'
  },
  { 
    id: 'aqua-blue',
    name: 'Aqua Blue',
    gradient: 'from-[#00C4CC] to-[#4B6CB7]',
    previewGradient: 'from-[#00C4CC]/90 to-[#4B6CB7]/90'
  },
  { 
    id: 'vapor-pink',
    name: 'Vapor Pink',
    gradient: 'from-[#FC67FA] to-[#6A82FB]',
    previewGradient: 'from-[#FC67FA]/90 to-[#6A82FB]/90'
  },
  { 
    id: 'neon-future',
    name: 'Neon Future',
    gradient: 'from-[#FF3CAC] via-[#784BA0] to-[#2B86C5]',
    previewGradient: 'from-[#FF3CAC]/90 via-[#784BA0]/90 to-[#2B86C5]/90'
  },
  { 
    id: 'sunset-gold',
    name: 'Sunset Gold',
    gradient: 'from-[#F7971E] to-[#FFD200]',
    previewGradient: 'from-[#F7971E]/90 to-[#FFD200]/90'
  }
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
  const [showXPAnimation, setShowXPAnimation] = useState<{ amount: number; isVisible: boolean }>({ amount: 0, isVisible: false });
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    avatar: null,
    bio: '',
    tags: [],
    theme: THEMES[0].id,
    coverImage: null,
    xp: 0
  });

  const checklist = useMemo(() => [
    { id: 'username', label: 'Choose username', isComplete: profileData.username.length >= 3, xpReward: 50 },
    { id: 'avatar', label: 'Upload avatar', isComplete: !!profileData.avatar, xpReward: 100 },
    { id: 'bio', label: 'Add bio', isComplete: profileData.bio.length > 0, xpReward: 50 },
    { id: 'tags', label: 'Add tags', isComplete: profileData.tags.length > 0, xpReward: 25 },
    { id: 'theme', label: 'Pick theme', isComplete: !!profileData.theme, xpReward: 25 },
  ], [profileData.username.length, profileData.avatar, profileData.bio.length, profileData.tags.length, profileData.theme]);

  const isValid = checklist.every(item => item.isComplete);

  useEffect(() => {
    // Calculate profile strength and XP
    const completedItems = checklist.filter(item => item.isComplete);
    const strength = Math.round((completedItems.length / checklist.length) * 100);
    setProfileStrength(strength);

    // Calculate total XP
    const totalXP = completedItems.reduce((sum, item) => sum + item.xpReward, 0);
    
    // If XP has increased, show animation
    if (totalXP > profileData.xp) {
      setShowXPAnimation({ amount: totalXP - profileData.xp, isVisible: true });
      setTimeout(() => setShowXPAnimation({ amount: 0, isVisible: false }), 2000);
    }
    
    setProfileData(prev => ({ ...prev, xp: totalXP }));

    // Trigger confetti when all items are complete
    if (strength === 100 && !isValid) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#A259FF', '#6B4EFF', '#241654']
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

  const currentTheme = THEMES.find(t => t.id === profileData.theme) || THEMES[0];

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <Link href="/auth/verify" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm font-medium text-gray-600"
        >
          <Sparkles className="w-4 h-4 text-[#A259FF]" />
          <span className="font-display">Building your profile</span>
        </motion.div>
        <div className="w-6" />
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold font-display text-gray-900 mb-3">
            Your trading profile
          </h1>
          <p className="text-gray-600 font-medium">
            This is how other traders will see you on tradr.co/{profileData.username || 'username'}
          </p>
        </motion.div>

        <div className="flex gap-12">
          {/* Left Sidebar - Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 space-y-8"
          >
            {/* XP Badge */}
            <div className="relative bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A259FF] to-[#6B4EFF] flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Total XP</div>
                  <div className="text-2xl font-bold font-display text-gray-900">{profileData.xp}</div>
                </div>
              </div>

              {/* Level Badge */}
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-[#A259FF]" />
                <span className="text-sm font-medium">Level 1 Trader</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileStrength}%` }}
                  className={`h-full bg-gradient-to-r ${currentTheme.gradient}`}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs font-medium text-gray-500">
                  Profile Strength
                </div>
                <div className="text-xs font-bold text-gray-700">
                  {profileStrength}%
                </div>
              </div>

              {/* XP Animation */}
              <AnimatePresence>
                {showXPAnimation.isVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: -20 }}
                    exit={{ opacity: 0, y: -40 }}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[#A259FF] font-bold"
                  >
                    <Star className="w-4 h-4" />
                    +{showXPAnimation.amount} XP
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-display font-bold text-gray-900">Setup Checklist</h3>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-6 h-6 rounded-xl flex items-center justify-center ${
                      item.isComplete 
                        ? 'bg-gradient-to-br from-[#A259FF] to-[#6B4EFF]' 
                        : 'bg-gray-100'
                    }`}>
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        item.isComplete ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-400">
                        +{item.xpReward} XP
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Profile Card Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 max-w-md"
          >
            {/* Card Container */}
            <div className="relative rounded-[2rem] shadow-xl overflow-hidden bg-white border border-gray-100">
              {/* Gradient Background with Animated Overlay */}
              <div className={`h-full absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-[0.98]`}>
                <motion.div
                  initial={{ opacity: 0, scale: 1.2 }}
                  animate={{ opacity: 0.1, scale: 1 }}
                  transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.2),_rgba(255,255,255,0))]"
                />
                {profileData.coverImage && (
                  <Image
                    src={profileData.coverImage}
                    alt="Cover"
                    fill
                    className="object-cover opacity-40 mix-blend-overlay"
                  />
                )}
              </div>

              {/* Content Container */}
              <div className="relative px-8 py-10">
                {/* Avatar */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-32 h-32 mx-auto mb-6 rounded-[2rem] bg-white/10 border-4 border-white/20 shadow-lg overflow-hidden group backdrop-blur-sm"
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/60">
                      <Camera className="w-8 h-8" />
                      <span className="text-xs font-medium">Add photo</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
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

                {/* Profile Info */}
                <div className="space-y-4 text-center">
                  {/* Username */}
                  <div className="relative inline-block">
                    {editingField === 'username' ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center"
                      >
                        <span className="text-3xl font-bold text-white/60">@</span>
                        <input
                          autoFocus
                          value={profileData.username}
                          onChange={(e) => setProfileData({ ...profileData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                          placeholder="username"
                          className="text-3xl font-bold w-full bg-transparent outline-none border-b-2 border-white/20 ml-1 text-center font-display text-white placeholder-white/40"
                        />
                      </motion.div>
                    ) : (
                      <motion.button
                        onClick={() => setEditingField('username')}
                        className="group"
                      >
                        <span className="text-3xl font-bold text-white/60">@</span>
                        <span className="text-3xl font-bold text-white font-display">
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
                            <div className="flex items-center gap-1 text-white/80 text-sm">
                              <Check className="w-4 h-4" />
                            </div>
                          </motion.div>
                        )}
                        {usernameAvailable === false && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -bottom-6 left-0 right-0 text-red-300 text-sm"
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
                        className="w-full bg-transparent outline-none resize-none text-white/80 text-center border-b-2 border-white/20 font-medium placeholder-white/40"
                        rows={2}
                      />
                    ) : (
                      <motion.button
                        onClick={() => setEditingField('bio')}
                        className="text-white/80 hover:text-white transition-colors font-medium"
                      >
                        {profileData.bio || 'Add a short bio'}
                      </motion.button>
                    )}
                  </div>

                  {/* Stats Row */}
                  <div className="flex justify-center gap-6 py-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold font-display text-white">{profileData.xp}</div>
                      <div className="text-sm text-white/60">XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold font-display text-white">1</div>
                      <div className="text-sm text-white/60">Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold font-display text-white">{profileData.tags.length}</div>
                      <div className="text-sm text-white/60">Tags</div>
                    </div>
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
                          className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-sm text-white text-sm font-medium flex items-center gap-1.5 group hover:bg-white/20 transition-all border border-white/10"
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
                        className="px-4 py-2 rounded-2xl border border-dashed border-white/20 text-white/60 text-sm font-medium hover:border-white/40 hover:text-white/80 transition-colors backdrop-blur-sm"
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
                          className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20 focus:outline-none focus:border-white/40 placeholder-white/40"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Link Preview */}
                  <motion.button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-sm text-white/80 hover:text-white transition-colors group mx-auto mt-6 border border-white/10"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span className="font-mono text-sm">tradr.co/{profileData.username || 'username'}</span>
                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                  <AnimatePresence>
                    {showCopied && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs text-white/60"
                      >
                        Copied to clipboard!
                      </motion.div>
                    )}
                  </AnimatePresence>
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
              <div className="text-center text-sm font-medium text-gray-500 mb-4">
                Choose your profile theme
              </div>
              <div className="flex justify-center gap-3">
                {THEMES.map((theme) => (
                  <motion.button
                    key={theme.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileData({ ...profileData, theme: theme.id })}
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${theme.gradient} ${
                      profileData.theme === theme.id 
                        ? 'ring-2 ring-[#A259FF] ring-offset-2' 
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
              className="mt-8 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#A259FF]/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-[#A259FF]" />
                </div>
                <span className="font-display font-bold text-gray-900">Your tradr page is almost ready</span>
              </div>
              <p className="text-sm text-gray-600 ml-11">
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
                className={`w-full py-4 rounded-2xl font-medium text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  isValid 
                    ? `bg-gradient-to-r ${currentTheme.gradient} text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]` 
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <span className="font-display">Continue</span>
                {isValid && <Check className="w-5 h-5" />}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 