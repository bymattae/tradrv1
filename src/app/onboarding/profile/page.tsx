'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, X, Link as LinkIcon, Sparkles, Lock, Shield, Copy, Trophy, Star, Tags, BadgeCheck, Sparkle, Zap, Target, Flame, Share, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { LucideIcon } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ProfileData {
  username: string;
  avatar: string | null;
  bio: string;
  tags: string[];
  theme: string;
  coverImage: string | null;
  xp: number;
  level: number;
  followers: number;
  following: number;
  trades: number;
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
    xp: 0,
    level: 1,
    followers: 0,
    following: 0,
    trades: 0
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
                <span className="text-sm font-medium">Level {Math.floor(profileData.xp / 100) + 1}</span>
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
            <div className="relative aspect-[1.4/1] rounded-3xl shadow-xl overflow-hidden bg-white border border-gray-100 group">
              {/* Gradient Background with Animated Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-[0.98] transition-all duration-500`}>
                <motion.div
                  initial={{ opacity: 0, scale: 1.2 }}
                  animate={{ opacity: 0.1, scale: 1 }}
                  transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.2),_rgba(255,255,255,0))]"
                />
              </div>

              {/* Content Container */}
              <div className="relative p-6">
                <div className="flex items-start gap-5">
                  {/* Avatar with Level Ring */}
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-white/50 to-white/20 rounded-full blur-sm"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAvatarClick}
                      className="relative w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 shadow-lg overflow-hidden group backdrop-blur-sm"
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
                          <Camera className="w-6 h-6" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </motion.button>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#A259FF] to-[#6B4EFF] flex items-center justify-center text-[10px] font-bold text-white">
                        {Math.floor(profileData.xp / 100) + 1}
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 min-w-0">
                    {/* Username with Verified Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <motion.button
                        onClick={() => setEditingField('username')}
                        className="flex items-center gap-2 group"
                      >
                        <span className="text-2xl font-bold text-white/60">@</span>
                        <span className="text-2xl font-bold text-white font-display truncate">
                          {profileData.username || 'username'}
                        </span>
                        {usernameAvailable && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center"
                          >
                            <BadgeCheck className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    </div>

                    {/* Bio */}
                    <div className="mb-3">
                      <motion.button
                        onClick={() => setEditingField('bio')}
                        className="text-white/80 hover:text-white transition-colors font-medium text-left block w-full"
                      >
                        {profileData.bio || 'Add a short bio'}
                      </motion.button>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-3 text-sm font-medium text-white/90 mb-4 bg-white/5 rounded-2xl px-4 py-2 backdrop-blur-sm border border-white/10">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-4 h-4" />
                        <span>Level {Math.floor(profileData.xp / 100) + 1}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4" />
                        <span>{profileData.xp} XP</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <div className="flex items-center gap-1.5">
                        <Tags className="w-4 h-4" />
                        <span>{profileData.tags.length} Tags</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {profileData.tags.slice(0, 3).map((tag) => {
                          const tagText = tag.split(' ')[1];
                          const TagIcon = (TAG_ICONS[tagText.toLowerCase()] as LucideIcon) || Target;
                          return (
                            <motion.button
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleTagToggle(tag)}
                              className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm text-white text-sm font-medium flex items-center gap-1.5 group hover:bg-white/20 transition-all border border-white/10"
                            >
                              <TagIcon className="w-3.5 h-3.5" />
                              {tagText}
                              <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Link Preview */}
                <motion.button
                  onClick={handleCopyLink}
                  className="absolute bottom-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm text-white/80 hover:text-white transition-colors group border border-white/10"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span className="font-mono text-sm">tradr.co/{profileData.username || 'username'}</span>
                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
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

            {/* Preview Share Card Button */}
            <motion.button
              onClick={handlePreviewShare}
              className="mt-4 w-full py-3 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-[#A259FF]/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <div className="w-5 h-5 rounded-lg bg-[#A259FF]/10 flex items-center justify-center group-hover:bg-[#A259FF]/20 transition-colors">
                <Share2 className="w-3 h-3 text-[#A259FF]" />
              </div>
              <span className="font-medium text-gray-900">Preview Share Card</span>
            </motion.button>

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

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="aspect-[1.4/1] relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-6">
            {/* Card Preview Content */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20">
                  {profileData.avatar && (
                    <Image
                      src={profileData.avatar}
                      alt="Profile"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs font-medium px-1.5 rounded-full">
                  {Math.floor(profileData.xp / 100) + 1}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{profileData.username}</span>
                  <BadgeCheck className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground mt-1">{profileData.bio}</div>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl mb-4">
              <div className="text-center">
                <div className="text-sm font-medium">{profileData.followers}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{profileData.following}</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{profileData.trades}</div>
                <div className="text-xs text-muted-foreground">Trades</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {profileData.tags.map((tag) => {
                const tagText = tag.split(' ')[1];
                const TagIcon = (TAG_ICONS[tagText.toLowerCase()] as LucideIcon) || Target;
                return (
                  <div
                    key={tag}
                    className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full text-sm"
                  >
                    <TagIcon className="w-4 h-4 text-primary" />
                    <span>{tagText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 