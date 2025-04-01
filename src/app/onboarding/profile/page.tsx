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
  textColor: string;
  borderColor: string;
  inputBg: string;
  inputText: string;
  placeholderText: string;
  shadowColor: string;
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
    id: 'black',
    name: 'Black Metal',
    bgGradient: 'bg-[linear-gradient(145deg,#111111,#2A2A2A)]',
    textColor: 'text-white',
    borderColor: 'border-[#3A3A3A]',
    inputBg: 'bg-[#252525]/60',
    inputText: 'text-white',
    placeholderText: 'text-white/50',
    shadowColor: 'shadow-[#000000]',
    description: 'Premium black metal finish'
  },
  {
    id: 'gold',
    name: 'Gold Metal',
    bgGradient: 'bg-[linear-gradient(145deg,#D9C183,#C6A759)]',
    textColor: 'text-[#3a2d1b]',
    borderColor: 'border-[#C5B686]',
    inputBg: 'bg-[#CAB980]/25',
    inputText: 'text-[#3a2d1b]',
    placeholderText: 'text-[#3a2d1b]/50',
    shadowColor: 'shadow-[#9E8B55]',
    description: 'Luxurious gold finish'
  },
  {
    id: 'lavender',
    name: 'Lavender Metal',
    bgGradient: 'bg-[linear-gradient(145deg,#C1AEE0,#9273C7)]',
    textColor: 'text-black',
    borderColor: 'border-[#A48FCB]',
    inputBg: 'bg-[#A490C4]/30',
    inputText: 'text-black',
    placeholderText: 'text-black/50',
    shadowColor: 'shadow-[#6A569D]',
    description: 'Elegant lavender finish'
  },
  {
    id: 'space-grey',
    name: 'Space Grey',
    bgGradient: 'bg-[linear-gradient(145deg,#7A7A7F,#515155)]',
    textColor: 'text-white',
    borderColor: 'border-[#7B7A7E]',
    inputBg: 'bg-[#7C7B7F]/30',
    inputText: 'text-white',
    placeholderText: 'text-white/50',
    shadowColor: 'shadow-[#4D4C4F]',
    description: 'Modern space grey finish'
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    bgGradient: 'bg-[linear-gradient(145deg,#E5B9B2,#C48A80)]',
    textColor: 'text-[#2d1b1b]',
    borderColor: 'border-[#D1A39D]',
    inputBg: 'bg-[#D5A59E]/25',
    inputText: 'text-[#2d1b1b]',
    placeholderText: 'text-black/50',
    shadowColor: 'shadow-[#96655F]',
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
    <div className={`min-h-screen bg-neutral-100 overflow-y-auto py-10 ${spaceGrotesk.variable}`}>
      <div className="flex flex-col items-center px-4 pb-12">
        <div className="relative w-full max-w-md mb-16">
          <div className="absolute top-0 w-full text-center mb-8">
            <div className="inline-block px-3 py-1 bg-black/10 backdrop-blur-sm rounded-full text-sm font-medium text-black/70">
              Step 2 of 3
            </div>
          </div>

          <div className="mt-14 overflow-hidden">
            {/* Header */}
            <div className="text-center space-y-1 mb-5 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-black">Build your profile</h1>
              <p className="text-base text-neutral-500">Make it stand out</p>
            </div>

            {/* Main Card */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden max-w-sm mx-auto">
                {/* Card background */}
                <div className={`relative w-full ${currentTheme.bgGradient} p-5 sm:p-6`}>
                  {/* Metallic effects */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.3),transparent_40%,rgba(0,0,0,0.1))]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.5),transparent_70%)]" />
                  
                  {/* Light reflective edge */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/40" />
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black/10" />
                  
                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    {/* Username with Avatar */}
                    <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                      {/* Profile Picture */}
                      <div
                        className="relative h-12 w-12 rounded-full overflow-hidden border border-white/30 cursor-pointer flex-shrink-0"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                        {profileData.avatar ? (
                          <Image
                            src={profileData.avatar}
                            alt="Profile"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-white/10">
                            <Camera className={`w-5 h-5 ${currentTheme.textColor}/70`} />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm">
                          <Camera className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      {/* Username with @ symbol */}
                      <div 
                        className={`flex-1 text-left ${currentTheme.textColor} text-xl font-medium cursor-pointer rounded-xl transition-colors`}
                        onClick={() => setEditingField('username')}
                      >
                        {editingField === 'username' ? (
                          <div className="flex items-center">
                            <span className={`text-xl ${currentTheme.textColor}/70`}>@</span>
                            <input
                              type="text"
                              value={profileData.username}
                              onChange={(e) => handleFieldEdit('username', e.target.value)}
                              className={`w-full bg-transparent border-none focus:outline-none text-xl ${currentTheme.inputText} pl-1`}
                              placeholder="yourname"
                              onBlur={() => setEditingField(null)}
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className={`text-xl ${currentTheme.textColor}/70`}>@</span>
                            <span className="pl-1">{profileData.username || "username"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Bio */}
                    <div 
                      className={`relative w-full text-center ${currentTheme.textColor} text-base bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.15)] cursor-pointer`}
                      onClick={() => setEditingField('bio')}
                    >
                      {editingField === 'bio' ? (
                        <input
                          type="text"
                          value={profileData.bio}
                          onChange={(e) => handleFieldEdit('bio', e.target.value)}
                          className={`w-full text-center bg-transparent border-none focus:outline-none ${currentTheme.inputText}`}
                          placeholder="Add a short trader bio..."
                          onBlur={() => setEditingField(null)}
                          autoFocus
                        />
                      ) : (
                        <>{profileData.bio || "Add a short trader bio..."}</>
                      )}
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap justify-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                      {profileData.tags.map((tag, index) => (
                        <div
                          key={index}
                          className={`px-3 py-1.5 rounded-lg ${currentTheme.textColor} text-sm flex items-center gap-1.5 bg-white/10 border border-white/10`}
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => handleTagToggle(tag)}
                            className="opacity-50 hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
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
                          className={`px-3 py-1.5 rounded-lg bg-white/5 ${currentTheme.inputText} text-sm border border-dashed border-white/20 w-32 text-center`}
                          placeholder="#addhashtag"
                        />
                      )}
                    </div>
                    
                    {/* Stats */}
                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                      <div className="flex items-center justify-between">
                        <div className="text-center flex-1">
                          <div className={`text-lg font-semibold ${currentTheme.textColor}`}>
                            +0.0%
                          </div>
                          <div className={`text-xs ${currentTheme.textColor} uppercase tracking-wider`}>
                            Gain
                          </div>
                        </div>
                        <div className="text-center flex-1">
                          <div className={`text-lg font-semibold ${currentTheme.textColor}`}>
                            0%
                          </div>
                          <div className={`text-xs ${currentTheme.textColor} uppercase tracking-wider`}>
                            Win Rate
                          </div>
                        </div>
                        <div className="text-center flex-1">
                          <div className={`text-lg font-semibold ${currentTheme.textColor}`}>
                            0.0
                          </div>
                          <div className={`text-xs ${currentTheme.textColor} uppercase tracking-wider`}>
                            Avg R:R
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Theme Selection */}
                    <div className="flex justify-center gap-2 pt-2">
                      {THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setProfileData({ ...profileData, theme: theme.id })}
                          className={`relative w-10 h-10 rounded-full overflow-hidden transition-transform hover:scale-110 ${
                            profileData.theme === theme.id ? 'ring-2 ring-white/70' : ''
                          }`}
                        >
                          <div className={`absolute inset-0 ${theme.bgGradient}`} />
                          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                          {profileData.theme === theme.id && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white/30 rounded-full p-1">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    {/* Footer */}
                    <div className="pt-2 text-center">
                      <div className={`text-sm font-bold ${currentTheme.textColor}`}>
                        Made with <span className="text-[#00E396]">#Tradr</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* For avatar upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
}