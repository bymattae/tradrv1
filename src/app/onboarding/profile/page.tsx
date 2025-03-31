'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, X, Link as LinkIcon, Sparkles, Lock, Shield, Copy, Trophy, Star, Tags, BadgeCheck, Sparkle, Zap, Target, Flame, Share, Share2, Info, Download } from 'lucide-react';
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
          className={`relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br ${currentTheme.gradient} p-6 shadow-xl`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Avatar & Username Section */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
              onClick={handleAvatarClick}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
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
              <motion.div
                className="absolute -bottom-1 -right-1 bg-primary text-white text-xs font-medium px-2 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {Math.floor(profileData.xp / 100) + 1}
              </motion.div>
            </motion.button>

            <div className="w-full max-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => handleFieldEdit('username', e.target.value)}
                  className="w-full text-center text-xl font-semibold text-white bg-transparent border-b-2 border-white/20 focus:border-white/40 focus:outline-none transition-colors px-2 py-1"
                  placeholder="Username"
                />
                <AnimatePresence>
                  {usernameAvailable && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-0 top-1/2 -translate-y-1/2"
                    >
                      <Check className="w-5 h-5 text-green-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <input
                type="text"
                value={profileData.bio}
                onChange={(e) => handleFieldEdit('bio', e.target.value)}
                className="w-full text-center text-sm text-white/80 bg-transparent border-none focus:outline-none mt-2"
                placeholder="Write a short bio..."
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl mb-6">
            <div className="text-center group">
              <div className="text-lg font-semibold text-white">{Math.floor(profileData.xp / 100) + 1}</div>
              <div className="text-xs text-white/60 group-hover:text-white/80 transition-colors">Level</div>
            </div>
            <div className="text-center group">
              <div className="text-lg font-semibold text-white">{profileData.xp}</div>
              <div className="text-xs text-white/60 group-hover:text-white/80 transition-colors">XP</div>
            </div>
            <div className="text-center group">
              <div className="text-lg font-semibold text-white">{profileData.tags.length}/5</div>
              <div className="text-xs text-white/60 group-hover:text-white/80 transition-colors">Tags</div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
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

          {/* Profile Link */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white text-sm">
              tradr.co/{profileData.username || 'username'}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <Copy className="w-4 h-4 text-white" />
            </motion.button>
          </div>

          {/* Theme Picker */}
          <div className="flex justify-center gap-2">
            {THEMES.map((theme) => (
              <motion.button
                key={theme.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.gradient} ${
                  theme.id === currentTheme.id ? 'ring-2 ring-white scale-110' : ''
                }`}
                onClick={() => handleFieldEdit('theme', theme.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Preview Modal */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="sm:max-w-md p-0 bg-transparent border-none">
            <div className="aspect-[4/5] w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl">
              {/* Preview content */}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 