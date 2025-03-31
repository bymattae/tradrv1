'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, X, Link as LinkIcon, Sparkles, Lock, Shield, Copy, Trophy, Star, Tags, BadgeCheck, Sparkle, Zap, Target, Flame, Share, Share2, Info, Download, TrendingUp, Percent, Wallet, Palette, ChevronDown, Plus, Moon, Sun, Pencil, Search, LineChart, AlertCircle, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { LucideIcon } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Space_Grotesk } from 'next/font/google';

interface Theme {
  id: string;
  name: string;
  gradient: string;
  textColor: string;
  tagBg: string;
  tagText: string;
  linkColor: string;
  statColor: string;
  accentColor: string;
  bgGradient: string;
  borderColor: string;
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
  verifiedAccounts: {
    live: number;
    funded: number;
  };
  link?: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  isComplete: boolean;
  xpReward: number;
}

interface TagSuggestion {
  text: string;
  icon: LucideIcon;
  category: string;
}

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const THEMES: Theme[] = [
  { 
    id: 'vapor',
    name: 'Vapor',
    gradient: 'from-[#A18CD1] via-[#FBC2EB] to-[#FBC2EB]',
    textColor: 'text-[#2a2a2a]',
    tagBg: 'bg-white/20',
    tagText: 'text-[#2a2a2a]',
    linkColor: 'text-[#2a2a2a]/90 hover:text-[#2a2a2a]',
    statColor: 'text-[#2a2a2a]',
    accentColor: 'text-[#A18CD1]',
    bgGradient: 'bg-gradient-to-br from-[#A18CD1] via-[#FBC2EB] to-[#FBC2EB]',
    borderColor: 'border-[#A18CD1]',
  },
  { 
    id: 'sunshine',
    name: 'Sunshine',
    gradient: 'from-[#FDEB71] via-[#F8D800] to-[#F8D800]',
    textColor: 'text-[#2a2a2a]',
    tagBg: 'bg-white/20',
    tagText: 'text-[#2a2a2a]',
    linkColor: 'text-[#2a2a2a]/90 hover:text-[#2a2a2a]',
    statColor: 'text-[#2a2a2a]',
    accentColor: 'text-[#F8D800]',
    bgGradient: 'bg-gradient-to-br from-[#FDEB71] via-[#F8D800] to-[#F8D800]',
    borderColor: 'border-[#F8D800]',
  },
  { 
    id: 'cloud',
    name: 'Cloud',
    gradient: 'from-[#A1C4FD] via-[#C2E9FB] to-[#C2E9FB]',
    textColor: 'text-[#2a2a2a]',
    tagBg: 'bg-white/20',
    tagText: 'text-[#2a2a2a]',
    linkColor: 'text-[#2a2a2a]/90 hover:text-[#2a2a2a]',
    statColor: 'text-[#2a2a2a]',
    accentColor: 'text-[#A1C4FD]',
    bgGradient: 'bg-gradient-to-br from-[#A1C4FD] via-[#C2E9FB] to-[#C2E9FB]',
    borderColor: 'border-[#A1C4FD]',
  },
  { 
    id: 'blush',
    name: 'Blush',
    gradient: 'from-[#FDCBCA] via-[#D4A5A5] to-[#D4A5A5]',
    textColor: 'text-[#2a2a2a]',
    tagBg: 'bg-white/20',
    tagText: 'text-[#2a2a2a]',
    linkColor: 'text-[#2a2a2a]/90 hover:text-[#2a2a2a]',
    statColor: 'text-[#2a2a2a]',
    accentColor: 'text-[#D4A5A5]',
    bgGradient: 'bg-gradient-to-br from-[#FDCBCA] via-[#D4A5A5] to-[#D4A5A5]',
    borderColor: 'border-[#D4A5A5]',
  },
  { 
    id: 'phantom',
    name: 'Phantom',
    gradient: 'from-[#8E9EAB] via-[#EEF2F3] to-[#EEF2F3]',
    textColor: 'text-[#2a2a2a]',
    tagBg: 'bg-white/20',
    tagText: 'text-[#2a2a2a]',
    linkColor: 'text-[#2a2a2a]/90 hover:text-[#2a2a2a]',
    statColor: 'text-[#2a2a2a]',
    accentColor: 'text-[#8E9EAB]',
    bgGradient: 'bg-gradient-to-br from-[#8E9EAB] via-[#EEF2F3] to-[#EEF2F3]',
    borderColor: 'border-[#8E9EAB]',
  },
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

const TAG_SUGGESTIONS: TagSuggestion[] = [
  { text: 'Day Trader', icon: Target, category: 'Style' },
  { text: 'Swing Trader', icon: Zap, category: 'Style' },
  { text: 'Crypto', icon: Sparkle, category: 'Market' },
  { text: 'Forex', icon: Flame, category: 'Market' },
  { text: 'Funded', icon: Shield, category: 'Status' },
  { text: 'Pro', icon: Star, category: 'Status' },
  { text: 'Technical', icon: LineChart, category: 'Strategy' },
  { text: 'Fundamental', icon: Info, category: 'Strategy' },
];

// Add new utility function for contrast calculation
const getContrastColor = (hexcolor: string) => {
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? 'text-black' : 'text-white';
};

// Add placeholder tags
const PLACEHOLDER_TAGS: TagSuggestion[] = [
  { text: 'SMC', icon: Target, category: 'Strategy' },
  { text: 'NAS100', icon: LineChart, category: 'Market' },
  { text: 'Supply/Demand', icon: Zap, category: 'Strategy' },
  { text: 'Funded', icon: Shield, category: 'Status' },
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
    verifiedAccounts: {
      live: 0,
      funded: 0,
    },
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showHolo, setShowHolo] = useState(false);
  const [previewBackground, setPreviewBackground] = useState<'dark' | 'light'>('dark');
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<TagSuggestion[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

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
    if (strength === 100 && !showConfetti) {
      setShowConfetti(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#A259FF', '#6B4EFF', '#241654']
      });
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }, [profileData, checklist, showConfetti]);

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

  const handleDownload = () => {
    // Implementation of handleDownload function
  };

  const handleTagSearch = (value: string) => {
    setTagSearch(value);
    if (value.length > 0) {
      const filtered = TAG_SUGGESTIONS.filter(tag => 
        tag.text.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleAddTagFromSuggestion = (suggestion: TagSuggestion) => {
    if (profileData.tags.length < 5) {
      const formattedTag = `📈 ${suggestion.text}`;
      setProfileData(prev => ({
        ...prev,
        tags: [...prev.tags, formattedTag]
      }));
      setShowTagInput(false);
      setTagSearch('');
      setFilteredSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 font-sans">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl border-b border-gray-100 mb-8">
        <Link href="/auth/verify" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-sm text-gray-500">Step 2 of 3</div>
      </nav>

      <div className="max-w-md mx-auto">
        {/* Profile Card Container */}
        <div className="relative w-full max-w-[400px] mx-auto">
          <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-md" />
          <div className={`relative bg-white/5 rounded-2xl p-6 border border-white/10 shadow-lg ${currentTheme.bgGradient}`}>
            {/* Avatar Section */}
            <div className="relative group">
              <div className={`w-32 h-32 mx-auto rounded-full border-4 ${currentTheme.borderColor} transition-colors duration-300 group-hover:border-white/30 overflow-hidden`}>
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 rounded-full p-3">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Username & Verification */}
            <div className="text-center w-full max-w-[280px] mx-auto mt-6">
              <div className="relative group">
                <div className="relative flex items-center justify-center">
                  <div className="flex items-center gap-1">
                    <span className={`text-4xl font-bold tracking-tight ${currentTheme.textColor} font-space-grotesk`}>@</span>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => handleFieldEdit('username', e.target.value.toLowerCase())}
                      className={`text-4xl font-bold tracking-tight ${currentTheme.textColor} bg-transparent border-none focus:outline-none transition-colors py-1 font-space-grotesk group-hover:bg-white/10 rounded-lg`}
                      placeholder="username"
                    />
                  </div>
                  {profileData.username.length >= 3 && (
                    <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 bg-white/10 rounded-full p-1">
                      {usernameAvailable ? (
                        <Check className="w-5 h-5 text-[#16c784]" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {profileData.username.length >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-1"
                >
                  <div className={`text-sm ${currentTheme.textColor}/80 font-medium tracking-wide font-space-grotesk`}>
                    tradr.co/{profileData.username}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Bio */}
            <div className="relative group w-full max-w-[280px] mx-auto mt-4">
              <div
                className={`text-center ${currentTheme.textColor} text-xl cursor-pointer group-hover:bg-white/10 rounded-lg px-4 py-3 transition-colors font-medium font-space-grotesk`}
                onClick={() => setEditingField('bio')}
              >
                {editingField === 'bio' ? (
                  <input
                    type="text"
                    value={profileData.bio}
                    onChange={(e) => handleFieldEdit('bio', e.target.value)}
                    className="w-full text-center bg-transparent border-none focus:outline-none font-space-grotesk text-xl"
                    placeholder="Add a short trader bio..."
                    onBlur={() => setEditingField(null)}
                    autoFocus
                  />
                ) : (
                  <>
                    {profileData.bio || "Add a short trader bio..."}
                    <Pencil className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${currentTheme.textColor}/40 opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </>
                )}
              </div>
            </div>

            {/* Tags Section */}
            <div className="mt-6 px-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-md" />
                <div className="relative bg-white/5 rounded-xl p-4 border border-white/10 shadow-lg">
                  <div className="flex flex-wrap justify-center gap-2">
                    {profileData.tags.map((tag, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`group relative px-3 py-1.5 rounded-full ${currentTheme.tagBg} ${currentTheme.tagText} text-sm font-medium flex items-center gap-1.5 hover:bg-white/20 transition-colors shadow-sm font-space-grotesk`}
                      >
                        <span className="lowercase">{tag}</span>
                        <button
                          onClick={() => handleTagToggle(tag)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                    {profileData.tags.length < 3 && (
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value.toLowerCase())}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTag.trim()) {
                            handleAddTag();
                            setNewTag('');
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full ${currentTheme.tagBg} ${currentTheme.tagText} text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/20 w-32 shadow-sm font-space-grotesk`}
                        placeholder="#addhashtag"
                      />
                    )}
                    {profileData.tags.length >= 3 && (
                      <div className={`text-xs ${currentTheme.textColor}/60 font-normal flex items-center gap-1 font-space-grotesk`}>
                        <AlertCircle className="w-3 h-3" />
                        You can only add up to 3 hashtags
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-6 px-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-md" />
                <div className="relative bg-white/5 rounded-xl p-4 border border-white/10 shadow-lg">
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <div className="text-xl font-bold tracking-wide text-black font-space-grotesk">
                        +0.0%
                      </div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1 font-space-grotesk">Gain</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold tracking-wide text-black font-space-grotesk">
                        0%
                      </div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1 font-space-grotesk">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold tracking-wide text-black font-space-grotesk">
                        0.0
                      </div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1 font-space-grotesk">Avg R:R</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-xs text-gray-400 font-normal flex items-center justify-center gap-1 font-space-grotesk">
                    You can sync your trading account once you&apos;ve completed your profile.
                    <Info className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Selection */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-md" />
                <div className="relative bg-white/5 rounded-xl p-4 border border-white/10 shadow-lg">
                  <div className="flex flex-wrap justify-center gap-3">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => handleFieldEdit('theme', theme.id)}
                        className={`relative group w-12 h-12 rounded-full transition-all duration-300 ${
                          currentTheme.name === theme.name
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-black/20'
                            : 'hover:ring-2 hover:ring-white/50 hover:ring-offset-2 hover:ring-offset-black/20'
                        }`}
                      >
                        <div className={`absolute inset-0 rounded-full ${theme.bgGradient} transition-all duration-300 group-hover:scale-110`} />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/10 to-transparent" />
                        <div className="absolute inset-0 rounded-full border border-white/10" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <div className={`text-sm ${currentTheme.textColor}/60 font-normal font-space-grotesk`}>
                Made with <span className="text-[#16c784]">#Tradr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}