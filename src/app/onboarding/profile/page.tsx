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
import { useToast } from '@/components/ui/use-toast';

interface Theme {
  id: string;
  name: string;
  bgGradient: string;
  borderColor: string;
  description: string;
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
    id: 'black-metal',
    name: 'Black Metal',
    bgGradient: 'bg-gradient-to-br from-[#1a1a1a] to-[#2e2e2e]',
    borderColor: 'border-[#3f3f3f]',
    description: 'Premium black metal finish'
  },
  {
    id: 'gold-metal',
    name: 'Gold Metal',
    bgGradient: 'bg-gradient-to-br from-[#d4c49d] to-[#b49b68]',
    borderColor: 'border-[#c5ae7c]',
    description: 'Luxurious gold finish'
  },
  {
    id: 'lavender-metal',
    name: 'Lavender Metal',
    bgGradient: 'bg-gradient-to-br from-[#c5b5e5] to-[#9c82d1]',
    borderColor: 'border-[#b79eda]',
    description: 'Elegant lavender finish'
  },
  {
    id: 'space-grey',
    name: 'Space Grey',
    bgGradient: 'bg-gradient-to-br from-[#a3a3a3] to-[#626262]',
    borderColor: 'border-[#8b8b8b]',
    description: 'Modern space grey finish'
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    bgGradient: 'bg-gradient-to-br from-[#d7a9a0] to-[#a86f65]',
    borderColor: 'border-[#c8988b]',
    description: 'Sophisticated rose gold finish'
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
  const { toast } = useToast();

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
    <div className="min-h-screen bg-[#fafafa] p-4 font-space-grotesk">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl border-b border-gray-100 mb-8">
        <Link href="/auth/verify" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-sm text-gray-500">Step 2 of 3</div>
      </nav>

      <div className="max-w-md mx-auto">
        {/* Profile Card Container */}
        <div className="relative w-full max-w-[420px] mx-auto px-4">
          <div className="absolute inset-0 bg-white/5 rounded-3xl backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)]" />
          <div className={`relative overflow-hidden rounded-3xl p-4 sm:p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] ${currentTheme.bgGradient}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent_50%,rgba(255,255,255,0.05))]" />
            <div className="relative">
              {/* Title Section */}
              <div className="text-center mb-6 sm:mb-8">
                <h1 className={`text-lg sm:text-xl font-bold ${
                  currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                    ? 'text-white'
                    : 'text-[#3a2d1b]'
                } font-space-grotesk drop-shadow-sm`}>
                  Build your profile
                </h1>
                <p className={`text-base sm:text-lg ${
                  currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                    ? 'text-white/60'
                    : 'text-[#3a2d1b]/60'
                } font-space-grotesk mt-1`}>
                  Make it stand out
                </p>
              </div>

              {/* Avatar Section */}
              <div className="relative group">
                <div className={`w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full border-2 ${currentTheme.borderColor}/20 transition-all duration-300 group-hover:border-white/30 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)]`}>
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <User className="w-14 h-14 sm:w-16 sm:h-16 text-gray-400" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-black/30 backdrop-blur-sm rounded-full p-2.5 sm:p-3 shadow-lg">
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Username & Verification */}
              <div className="text-center w-full max-w-[280px] mx-auto mt-5 sm:mt-6">
                <div className="relative group">
                  <div className="relative flex items-center justify-center">
                    <div className="relative w-full">
                      <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-xl sm:text-2xl font-semibold ${
                        currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                          ? 'text-white/30'
                          : 'text-[#3a2d1b]/30'
                      } font-space-grotesk`}>@</div>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => handleFieldEdit('username', e.target.value.toLowerCase().slice(0, 18))}
                        className={`w-full text-center text-xl sm:text-2xl font-semibold tracking-tight ${
                          currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                            ? 'text-white placeholder:text-white/30'
                            : 'text-[#3a2d1b] placeholder:text-[#3a2d1b]/30'
                        } bg-white/5 border border-white/10 rounded-2xl py-2.5 px-10 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)] font-space-grotesk`}
                        placeholder="username"
                      />
                      {profileData.username.length >= 3 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 rounded-full p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                          {usernameAvailable ? (
                            <Check className="w-4 h-4 text-[#00E396]" />
                          ) : (
                            <X className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {profileData.username.length >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-2"
                  >
                    <div className={`text-sm ${
                      currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                        ? 'text-white/50 hover:text-[#00E396]'
                        : 'text-[#3a2d1b]/50 hover:text-[#00E396]'
                    } font-medium tracking-wide transition-colors cursor-pointer font-space-grotesk`}>
                      tradr.co/{profileData.username.replace(/[^a-z0-9]/g, '')}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Bio */}
              <div className="relative group w-full max-w-[280px] mx-auto mt-5 sm:mt-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1)]" />
                  <div className="relative bg-white/5 rounded-2xl p-3 border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                    <div
                      className={`text-center ${
                        currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                          ? 'text-white'
                          : 'text-[#3a2d1b]'
                      } text-base sm:text-lg cursor-pointer group-hover:bg-white/5 rounded-xl px-3 py-2.5 transition-all duration-300 font-medium font-space-grotesk`}
                      onClick={() => setEditingField('bio')}
                    >
                      {editingField === 'bio' ? (
                        <input
                          type="text"
                          value={profileData.bio}
                          onChange={(e) => handleFieldEdit('bio', e.target.value)}
                          className={`w-full text-center bg-transparent border-none focus:outline-none font-space-grotesk text-base sm:text-lg ${
                            currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                              ? 'text-white placeholder:text-white/30'
                              : 'text-[#3a2d1b] placeholder:text-[#3a2d1b]/30'
                          }`}
                          placeholder="Add a short trader bio..."
                          onBlur={() => setEditingField(null)}
                          autoFocus
                        />
                      ) : (
                        <>
                          {profileData.bio || "Add a short trader bio..."}
                          <Pencil className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                            currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                              ? 'text-white/30'
                              : 'text-[#3a2d1b]/30'
                          } opacity-0 group-hover:opacity-100 transition-all duration-300`} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="mt-5 sm:mt-6 px-3 sm:px-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1)]" />
                  <div className="relative bg-white/5 rounded-2xl p-3 border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                    <div className="flex flex-wrap justify-center gap-2">
                      {profileData.tags.map((tag, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`group relative px-3 py-2 rounded-xl bg-white/5 ${
                            currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                              ? 'text-white'
                              : 'text-[#3a2d1b]'
                          } text-sm font-medium flex items-center gap-1.5 hover:bg-white/10 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.1)] font-space-grotesk min-h-[44px]`}
                        >
                          <span className="lowercase">{tag}</span>
                          <button
                            onClick={() => handleTagToggle(tag)}
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-1"
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
                          className={`px-3 py-2 rounded-xl bg-white/5 ${
                            currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                              ? 'text-white placeholder:text-white/30'
                              : 'text-[#3a2d1b] placeholder:text-[#3a2d1b]/30'
                          } text-sm font-medium border-2 border-dashed border-white/20 hover:border-white/30 focus:outline-none focus:border-white/40 w-32 shadow-[0_2px_8px_rgba(0,0,0,0.1)] font-space-grotesk min-h-[44px] text-center transition-colors duration-300`}
                          placeholder="#addhashtag"
                        />
                      )}
                      {profileData.tags.length >= 3 && (
                        <div className={`text-xs font-normal flex items-center gap-1 font-space-grotesk ${
                          currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                            ? 'text-white/50'
                            : 'text-[#3a2d1b]/50'
                        }`}>
                          <AlertCircle className="w-3 h-3" />
                          You can only add up to 3 hashtags
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-5 sm:mt-6 px-3 sm:px-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1)]" />
                  <div className="relative bg-white/5 rounded-2xl p-3 border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center justify-between gap-3 sm:gap-6">
                      <div className="text-center flex-1">
                        <div className={`text-lg sm:text-xl font-semibold tracking-wide ${
                          currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                            ? 'text-white'
                            : 'text-[#3a2d1b]'
                        } font-space-grotesk drop-shadow-sm`}>
                          +0.0%
                        </div>
                        <div className={`text-xs ${
                          currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                            ? 'text-white/40'
                            : 'text-[#3a2d1b]/40'
                        } font-medium uppercase tracking-wider mt-1 font-space-grotesk`}>Gain</div>
                      </div>
                      <div className="text-center flex-1">
                        <div className={`text-lg sm:text-xl font-semibold tracking-wide ${
                          currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                            ? 'text-white'
                            : 'text-[#3a2d1b]'
                        } font-space-grotesk drop-shadow-sm`}>
                          0%
                        </div>
                        <div className={`text-xs ${
                          currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                            ? 'text-white/40'
                            : 'text-[#3a2d1b]/40'
                        } font-medium uppercase tracking-wider mt-1 font-space-grotesk`}>Win Rate</div>
                      </div>
                      <div className="text-center flex-1">
                        <div className={`text-lg sm:text-xl font-semibold tracking-wide ${
                          currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                            ? 'text-white'
                            : 'text-[#3a2d1b]'
                        } font-space-grotesk drop-shadow-sm`}>
                          0.0
                        </div>
                        <div className={`text-xs ${
                          currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                            ? 'text-white/40'
                            : 'text-[#3a2d1b]/40'
                        } font-medium uppercase tracking-wider mt-1 font-space-grotesk`}>Avg R:R</div>
                      </div>
                    </div>
                    <div className={`mt-3 text-center text-xs font-normal flex items-center justify-center gap-1 font-space-grotesk ${
                      currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                        ? 'text-white/50'
                        : 'text-[#3a2d1b]/50'
                    }`}>
                      You can sync your trading account once you&apos;ve completed your profile.
                      <Info className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="mt-6 sm:mt-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-md shadow-[0_4px_32px_rgba(0,0,0,0.1)]" />
                  <div className="relative bg-white/5 rounded-2xl p-4 border border-white/10 shadow-[0_4px_32px_rgba(0,0,0,0.1)]">
                    <div className="grid grid-cols-5 gap-3">
                      {THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setProfileData({ ...profileData, theme: theme.id })}
                          className={`relative group w-12 h-12 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-110 hover:shadow-xl ${
                            profileData.theme === theme.id 
                              ? 'ring-2 ring-white/50 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                              : 'shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
                          }`}
                        >
                          <div className={`absolute inset-0 ${theme.bgGradient} shadow-inner`} />
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
                            <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                              {theme.name.split(' ')[0]}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 sm:mt-8 text-center">
                <div className={`text-sm font-bold font-space-grotesk ${
                  currentTheme.id === 'black-metal' || currentTheme.id === 'space-grey' || currentTheme.id === 'lavender-metal'
                    ? 'text-white'
                    : 'text-[#3a2d1b]'
                }`}>
                  Made with <span className="text-[#00E396]">#Tradr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}