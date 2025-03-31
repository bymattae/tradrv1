'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, X, Link as LinkIcon, Sparkles, Lock, Shield, Copy, Trophy, Star, Tags, BadgeCheck, Sparkle, Zap, Target, Flame, Share, Share2, Info, Download, TrendingUp, Percent, Wallet, Palette, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { LucideIcon } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ThemeCustomization {
  usernameColor: string;
  gradientStart: string;
  gradientEnd: string;
  statHighlight: string;
  avatarBorder: string;
}

interface ProfileData {
  username: string;
  avatar: string | null;
  bio: string;
  tags: string[];
  theme: string;
  coverImage: string | null;
  isVerified: boolean;
  showStats: boolean;
  level: number;
  xp: number;
  streak: number;
  lastSynced: Date | null;
  stats: {
    performance: number;
    winRate: number;
    maxDD: number;
  };
  hasConnectedStrategy: boolean;
  themeCustomization: ThemeCustomization;
  verifiedAccounts: {
    live: number;
    funded: number;
  };
}

interface ChecklistItem {
  id: string;
  label: string;
  isComplete: boolean;
  xpReward: number;
}

const THEMES = [
  { 
    id: 'vapor',
    name: 'Vapor',
    gradient: 'from-[#FC67FA] via-[#6A82FB] to-[#4B6CB7]',
    previewGradient: 'from-[#FC67FA]/90 via-[#6A82FB]/90 to-[#4B6CB7]/90',
    animation: 'animate-shimmer'
  },
  { 
    id: 'aurora',
    name: 'Aurora',
    gradient: 'from-[#00C4CC] via-[#4B6CB7] to-[#182848]',
    previewGradient: 'from-[#00C4CC]/90 via-[#4B6CB7]/90 to-[#182848]/90',
    animation: 'animate-float'
  },
  { 
    id: 'ultraviolet',
    name: 'Ultraviolet',
    gradient: 'from-[#A259FF] via-[#6B4EFF] to-[#241654]',
    previewGradient: 'from-[#A259FF]/90 via-[#6B4EFF]/90 to-[#241654]/90',
    animation: 'animate-pulse'
  },
  { 
    id: 'neon-fade',
    name: 'Neon Fade',
    gradient: 'from-[#FF3CAC] via-[#784BA0] to-[#2B86C5]',
    previewGradient: 'from-[#FF3CAC]/90 via-[#784BA0]/90 to-[#2B86C5]/90',
    animation: 'animate-glow'
  },
  { 
    id: 'yellow-flame',
    name: 'Yellow Flame',
    gradient: 'from-[#F7971E] via-[#FFD200] to-[#FF6B6B]',
    previewGradient: 'from-[#F7971E]/90 via-[#FFD200]/90 to-[#FF6B6B]/90',
    animation: 'animate-flicker'
  }
];

const TAG_ICONS: Record<string, LucideIcon> = {
  'trader': Target,
  'funded': Zap,
  'crypto': Sparkle,
  'forex': Flame,
  // Add more tag icons as needed
};

const SUGGESTED_TAGS = [
  '🎯 Trader',
  '⚡ Funded',
  '✨ Crypto',
  '🔥 Forex',
];

const USERNAME_COLORS = [
  { name: 'White', value: 'text-white' },
  { name: 'Black', value: 'text-black' },
  { name: 'Neon Blue', value: 'text-blue-400' },
  { name: 'Soft Pink', value: 'text-pink-300' },
];

const STAT_HIGHLIGHTS = [
  { name: 'Violet', value: 'from-violet-400 to-violet-600' },
  { name: 'Cyan', value: 'from-cyan-400 to-cyan-600' },
  { name: 'Yellow', value: 'from-yellow-400 to-yellow-600' },
  { name: 'Red', value: 'from-red-400 to-red-600' },
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
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    avatar: null,
    bio: '',
    tags: [],
    theme: THEMES[0].id,
    coverImage: null,
    isVerified: false,
    showStats: true,
    level: 1,
    xp: 0,
    streak: 0,
    lastSynced: null,
    stats: {
      performance: 42.8,
      winRate: 68,
      maxDD: 8
    },
    hasConnectedStrategy: false,
    themeCustomization: {
      usernameColor: 'text-white',
      gradientStart: '#FC67FA',
      gradientEnd: '#6A82FB',
      statHighlight: 'from-violet-400 to-violet-600',
      avatarBorder: 'ring-white/20',
    },
    verifiedAccounts: {
      live: 0,
      funded: 0,
    },
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showHolo, setShowHolo] = useState(false);

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFieldEdit = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tag: string) => {
    setProfileData(prev => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag].slice(0, 3);
      return { ...prev, tags };
    });
  };

  const handlePreviewShare = () => {
    setIsPreviewOpen(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleThemeCustomization = (field: keyof ThemeCustomization, value: string) => {
    setProfileData(prev => ({
      ...prev,
      themeCustomization: {
        ...prev.themeCustomization,
        [field]: value
      }
    }));
  };

  const currentTheme = THEMES.find(t => t.id === profileData.theme) || THEMES[0];

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 font-sans">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl border-b border-gray-100 mb-8">
        <Link href="/auth/verify" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${profileStrength}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">{profileStrength}%</span>
          </motion.div>
          <button
            onClick={handlePreviewShare}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors"
          >
            Preview
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-md mx-auto">
        {/* Profile Card */}
        <motion.div
          className={`relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-[${profileData.themeCustomization.gradientStart}] to-[${profileData.themeCustomization.gradientEnd}] p-4 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${showHolo ? 'animate-holo' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-yellow-400/90 to-yellow-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-bold shadow-lg"
            >
              Level {profileData.level} Trader
            </motion.div>
            {profileData.isVerified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-blue-400/90 to-blue-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-bold shadow-lg flex items-center gap-1"
              >
                <BadgeCheck className="w-4 h-4" />
                Verified by Broker
              </motion.div>
            )}
            {profileData.streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-red-400/90 to-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-bold shadow-lg flex items-center gap-1"
              >
                <Flame className="w-4 h-4" />
                {profileData.streak} Day Streak
              </motion.div>
            )}
            {profileData.isVerified && profileData.lastSynced && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white/80 text-xs"
              >
                Last synced: {profileData.lastSynced.toLocaleTimeString()}
              </motion.div>
            )}
          </div>

          {/* Avatar & Username Section */}
          <div className="flex flex-col items-center gap-2 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
              onClick={handleAvatarClick}
            >
              <div className={`w-20 h-20 rounded-full overflow-hidden ring-2 ${profileData.themeCustomization.avatarBorder} group-hover:ring-white/40 transition-all`}>
                {profileData.avatar ? (
                  <Image
                    src={profileData.avatar}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white/40" />
                  </div>
                )}
              </div>
            </motion.button>

            <div className="w-full max-w-[200px] text-center">
              <div className="relative">
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => handleFieldEdit('username', e.target.value)}
                  className={`w-full text-center text-2xl font-bold ${profileData.themeCustomization.usernameColor} bg-transparent border-none focus:outline-none transition-colors px-2 py-1 font-inter`}
                  placeholder="Username"
                />
                {usernameAvailable && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                  >
                    <Check className="w-5 h-5 text-green-400" />
                  </motion.div>
                )}
              </div>
              <div
                className="mt-1 text-sm text-white/60 cursor-pointer hover:text-white transition-colors"
                onClick={() => setEditingField('bio')}
              >
                {editingField === 'bio' ? (
                  <input
                    type="text"
                    value={profileData.bio}
                    onChange={(e) => handleFieldEdit('bio', e.target.value)}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                    placeholder="Write a short bio..."
                    onBlur={() => setEditingField(null)}
                    autoFocus
                  />
                ) : (
                  profileData.bio || "Click to add a bio..."
                )}
              </div>
            </div>
          </div>

          {/* Clean Stats Row */}
          <div className="flex items-center justify-center gap-6 mt-4">
            {profileData.hasConnectedStrategy ? (
              <>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-green-400">+{profileData.stats.performance}%</span>
                  </div>
                  <div className="text-xs text-white/60">Gain</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white flex items-center gap-1">
                    <Percent className="w-4 h-4" />
                    {profileData.stats.winRate}%
                  </div>
                  <div className="text-xs text-white/60">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white flex items-center gap-1">
                    <Wallet className="w-4 h-4" />
                    {profileData.verifiedAccounts.live}/{profileData.verifiedAccounts.funded}
                  </div>
                  <div className="text-xs text-white/60">Verified</div>
                </div>
              </>
            ) : (
              <div className="text-center group relative">
                <div className="text-lg font-semibold text-white/40 flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  Stats Hidden
                </div>
                <div className="text-xs text-white/40">Connect account to unlock stats</div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Connect your trading account to display performance stats
                </div>
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <AnimatePresence>
              {profileData.tags.map((tag) => {
                const tagText = tag.split(' ')[1];
                const TagIcon = (TAG_ICONS[tagText.toLowerCase()] as LucideIcon) || Target;
                return (
                  <motion.button
                    key={tag}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-sm text-white transition-colors"
                    onClick={() => handleTagToggle(tag)}
                  >
                    <TagIcon className="w-4 h-4" />
                    <span>{tagText}</span>
                    <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                );
              })}
            </AnimatePresence>
            {profileData.tags.length < 5 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-sm text-white transition-colors"
                onClick={() => setEditingField('tag')}
              >
                + Add Tag
              </motion.button>
            )}
          </div>

          {/* Theme Picker & Customizer */}
          <div className="flex flex-col items-center gap-3 mt-4">
            <div className="flex justify-center gap-2">
              {THEMES.map((theme) => (
                <motion.button
                  key={theme.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.gradient} ${
                    theme.id === currentTheme.id ? 'ring-2 ring-white scale-110 shadow-lg shadow-white/20' : ''
                  }`}
                  onClick={() => handleFieldEdit('theme', theme.id)}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-white/60">
                {currentTheme.name}
              </div>
              <button
                onClick={() => setShowThemeCustomizer(!showThemeCustomizer)}
                className="px-3 py-1 rounded-full text-sm bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors flex items-center gap-1"
              >
                <Palette className="w-4 h-4" />
                Customize
                <ChevronDown className={`w-4 h-4 transition-transform ${showThemeCustomizer ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Theme Customizer Panel */}
            <AnimatePresence>
              {showThemeCustomizer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-2"
                >
                  <div className="space-y-4">
                    {/* Username Color */}
                    <div>
                      <label className="text-xs text-white/60 mb-2 block">Username Color</label>
                      <div className="flex gap-2">
                        {USERNAME_COLORS.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => handleThemeCustomization('usernameColor', color.value)}
                            className={`w-8 h-8 rounded-full ${color.value} ${
                              profileData.themeCustomization.usernameColor === color.value ? 'ring-2 ring-white' : ''
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Stat Highlight */}
                    <div>
                      <label className="text-xs text-white/60 mb-2 block">Stat Highlight</label>
                      <div className="flex gap-2">
                        {STAT_HIGHLIGHTS.map((highlight) => (
                          <button
                            key={highlight.value}
                            onClick={() => handleThemeCustomization('statHighlight', highlight.value)}
                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${highlight.value} ${
                              profileData.themeCustomization.statHighlight === highlight.value ? 'ring-2 ring-white' : ''
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Holo Toggle */}
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-white/60">Holo Effect</label>
                      <button
                        onClick={() => setShowHolo(!showHolo)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          showHolo 
                            ? 'bg-white/20 text-white' 
                            : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        {showHolo ? '✨ On' : '✨ Off'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Preview Modal */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="sm:max-w-md p-0 bg-transparent border-none">
            <div className="aspect-[4/5] w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl">
              {/* Preview content */}
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl font-bold text-white mb-4">Your Shareable Card</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Image
                  </button>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </button>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share to X
                  </button>
                </div>
                <div className="mt-4 p-4 bg-white/5 rounded-xl">
                  <div className="text-center text-white/60 text-sm">
                    Scan to view profile
                  </div>
                  {/* QR Code would go here */}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 