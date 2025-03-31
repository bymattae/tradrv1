'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, X, Link as LinkIcon, Sparkles, Lock, Shield, Copy, Trophy, Star, Tags, BadgeCheck, Sparkle, Zap, Target, Flame, Share, Share2, Info, Download, TrendingUp, Percent, Wallet, Palette, ChevronDown, Plus, Moon, Sun, Pencil, Search, LineChart } from 'lucide-react';
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
  },
  { 
    id: 'daylight',
    name: 'Daylight',
    gradient: 'from-[#FDEB71] via-[#F8D800] to-[#F8D800]',
    textColor: 'text-[#2a2a2a]',
    tagBg: 'bg-white/20',
    tagText: 'text-[#2a2a2a]',
    linkColor: 'text-[#2a2a2a]/90 hover:text-[#2a2a2a]',
    statColor: 'text-[#2a2a2a]',
    accentColor: 'text-[#F8D800]',
  },
  { 
    id: 'dusk',
    name: 'Dusk',
    gradient: 'from-[#A1C4FD] via-[#C2E9FB] to-[#C2E9FB]',
    textColor: 'text-[#2a2a2a]',
    tagBg: 'bg-white/20',
    tagText: 'text-[#2a2a2a]',
    linkColor: 'text-[#2a2a2a]/90 hover:text-[#2a2a2a]',
    statColor: 'text-[#2a2a2a]',
    accentColor: 'text-[#A1C4FD]',
  },
  { 
    id: 'rose',
    name: 'Rose',
    gradient: 'from-[#FDCBCA] via-[#D4A5A5] to-[#D4A5A5]',
    textColor: 'text-[#2a2a2a]',
    tagBg: 'bg-white/20',
    tagText: 'text-[#2a2a2a]',
    linkColor: 'text-[#2a2a2a]/90 hover:text-[#2a2a2a]',
    statColor: 'text-[#2a2a2a]',
    accentColor: 'text-[#D4A5A5]',
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
          className={`relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br ${currentTheme.gradient} p-6 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${spaceGrotesk.variable}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
              onClick={handleAvatarClick}
            >
              <div className={`w-28 h-28 rounded-full overflow-hidden ring-2 ring-${currentTheme.accentColor}/20 group-hover:ring-${currentTheme.accentColor}/40 transition-all`}>
                {profileData.avatar ? (
                  <Image
                    src={profileData.avatar}
                    alt="Profile"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <Sparkles className={`w-10 h-10 ${currentTheme.accentColor}/40`} />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <div className="text-white text-sm font-medium">Tap to upload photo</div>
              </div>
            </motion.button>

            {/* Username & Verification */}
            <div className="text-center">
              <div className="relative group">
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg ${currentTheme.textColor}/60`}>@</span>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => handleFieldEdit('username', e.target.value.toLowerCase())}
                    className={`w-full text-center text-4xl font-extrabold tracking-tight ${currentTheme.textColor} bg-transparent border-none focus:outline-none transition-colors pl-8 pr-12 py-1 font-space-grotesk group-hover:bg-white/10 rounded-lg`}
                    placeholder="username"
                  />
                  {profileData.username.length >= 3 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameAvailable ? (
                        <Check className={`w-5 h-5 ${currentTheme.accentColor}`} />
                      ) : (
                        <X className={`w-5 h-5 text-red-400`} />
                      )}
                    </div>
                  )}
                </div>
                {profileData.username.length >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    <div className={`text-sm ${currentTheme.textColor}/60 font-medium`}>
                      tradr.co/{profileData.username}
                    </div>
                  </motion.div>
                )}
              </div>
              {profileData.isVerified && (
                <div className="mt-2 inline-flex items-center gap-1 group">
                  <BadgeCheck className={`w-4 h-4 ${currentTheme.accentColor}`} />
                  <span className={`text-xs ${currentTheme.textColor}/60 font-medium`}>Verified</span>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Verified account
                  </div>
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="relative group w-full max-w-[280px]">
              <div
                className={`text-center ${currentTheme.textColor} text-base cursor-pointer group-hover:bg-white/10 rounded-lg px-3 py-2 transition-colors font-medium`}
                onClick={() => setEditingField('bio')}
              >
                {editingField === 'bio' ? (
                  <input
                    type="text"
                    value={profileData.bio}
                    onChange={(e) => handleFieldEdit('bio', e.target.value)}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                    placeholder="Add a short trader bio..."
                    onBlur={() => setEditingField(null)}
                    autoFocus
                  />
                ) : (
                  <>
                    {profileData.bio || "Add a short trader bio..."}
                    <Pencil className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 ${currentTheme.textColor}/40 opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-8">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className={`text-xl font-semibold tracking-wide ${currentTheme.textColor}`}>
                  +{profileData.stats.performance}%
                </div>
                <div className={`text-xs ${currentTheme.textColor}/60 font-medium uppercase tracking-wider`}>Gain</div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-semibold tracking-wide ${currentTheme.textColor}`}>
                  {profileData.stats.winRate}%
                </div>
                <div className={`text-xs ${currentTheme.textColor}/60 font-medium uppercase tracking-wider`}>Win Rate</div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-semibold tracking-wide ${currentTheme.textColor}`}>
                  {profileData.stats.maxDD}
                </div>
                <div className={`text-xs ${currentTheme.textColor}/60 font-medium uppercase tracking-wider`}>Avg R:R</div>
              </div>
            </div>
            <div className={`mt-2 text-center text-xs ${currentTheme.textColor}/60 font-medium`}>
              You can sync your accounts in the next step
            </div>
          </div>

          {/* Tags Section */}
          <div className="mt-8">
            <div className="flex flex-wrap justify-center gap-2">
              {profileData.tags.map((tag, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`group relative px-3 py-1.5 rounded-full ${currentTheme.tagBg} ${currentTheme.tagText} text-sm font-medium flex items-center gap-1.5 hover:bg-white/20 transition-colors`}
                >
                  <span>{tag}</span>
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
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTag.trim()) {
                      handleAddTag();
                      setNewTag('');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full ${currentTheme.tagBg} ${currentTheme.tagText} text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/20 w-32`}
                  placeholder={`${3 - profileData.tags.length} tags left`}
                />
              )}
            </div>
          </div>

          {/* Theme Selection & Signature */}
          <div className="mt-8 space-y-4">
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
            <div className="text-center">
              <span className={`text-sm ${currentTheme.textColor}/40 font-space-grotesk italic`}>
                Made with #Tradr
              </span>
            </div>
          </div>

          {/* Link Section */}
          {profileData.link && (
            <div className="mt-8 text-center">
              <a
                href={profileData.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 ${currentTheme.linkColor} transition-colors text-sm font-medium group`}
              >
                <LinkIcon className={`w-4 h-4 ${currentTheme.accentColor}`} />
                {profileData.link}
                <Pencil className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity`} />
              </a>
            </div>
          )}
        </motion.div>

        {/* Preview Modal */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-2xl p-0 bg-transparent border-none">
            <div className="relative">
              {/* Preview Controls */}
              <div className="absolute -top-12 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={() => setPreviewBackground(previewBackground === 'dark' ? 'light' : 'dark')}
                  className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  {previewBackground === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {previewBackground === 'dark' ? 'Light Preview' : 'Dark Preview'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
              </div>

              {/* Preview Card */}
              <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br ${currentTheme.gradient} p-6 shadow-xl`}>
                {/* Status Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      Level {profileData.level}
                    </div>
                    {profileData.isVerified && (
                      <div className="px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="text-white/60 text-xs">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>

                {/* Avatar & Username Section */}
                <div className="flex flex-col items-center gap-3 mt-12">
                  <div className={`w-24 h-24 rounded-full overflow-hidden ring-2 ${currentTheme.textColor}/20`}>
                    {profileData.avatar ? (
                      <Image
                        src={profileData.avatar}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center">
                        <Camera className={`w-8 h-8 ${currentTheme.textColor}/40`} />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <div className={`text-3xl font-bold ${currentTheme.textColor} mb-2`}>
                      {profileData.username || 'Username'}
                    </div>
                    <div className="text-white/80 text-sm max-w-[280px] mx-auto">
                      {profileData.bio || 'Add a bio to tell your story'}
                    </div>
                  </div>
                </div>

                {/* Clean Stats Row */}
                <div className="flex items-center justify-center gap-8 mt-6">
                  {profileData.hasConnectedStrategy ? (
                    <>
                      <div className="text-center">
                        <div className={`text-xl font-semibold ${currentTheme.textColor} flex items-center gap-1`}>
                          <TrendingUp className={`w-4 h-4 ${currentTheme.accentColor}`} />
                          <span className={currentTheme.accentColor}>+{profileData.stats.performance}%</span>
                        </div>
                        <div className={`text-xs ${currentTheme.textColor} font-medium`}>Gain</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-semibold ${currentTheme.textColor} flex items-center gap-1`}>
                          <Percent className={`w-4 h-4 ${currentTheme.accentColor}`} />
                          {profileData.stats.winRate}%
                        </div>
                        <div className={`text-xs ${currentTheme.textColor} font-medium`}>Win Rate</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-semibold ${currentTheme.textColor} flex items-center gap-1`}>
                          <Wallet className={`w-4 h-4 ${currentTheme.accentColor}`} />
                          {profileData.verifiedAccounts.live}/{profileData.verifiedAccounts.funded}
                        </div>
                        <div className={`text-xs ${currentTheme.textColor} font-medium`}>Verified</div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center group relative">
                      <div className={`text-xl font-semibold ${currentTheme.textColor}/40 flex items-center gap-1`}>
                        <Lock className="w-4 h-4" />
                        Stats Hidden
                      </div>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Connect your trading account to display performance stats
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags Section */}
                <div className="mt-8">
                  <div className="flex flex-wrap justify-center gap-2">
                    {profileData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className={`px-3 py-1 rounded-full ${currentTheme.tagBg} ${currentTheme.tagText} text-sm`}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Link Section */}
                {profileData.link && (
                  <div className="mt-6 text-center">
                    <a
                      href={profileData.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 ${currentTheme.linkColor} transition-colors text-sm`}
                    >
                      <LinkIcon className="w-4 h-4" />
                      {profileData.link}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 