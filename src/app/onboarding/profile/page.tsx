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
    router.push('/onboarding/complete');
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
    <div className={`min-h-screen bg-[#121212] ${spaceGrotesk.variable} font-space-grotesk`}>
      {/* Header with back button and title */}
      <div className="sticky top-0 z-50 bg-[#121212] px-4 py-4 flex items-center">
        <Link href="/onboarding" className="text-gray-300 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="ml-4 flex-1">
          <h1 className="text-base font-semibold text-white">Build Your Profile</h1>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#242424] text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="bg-[#121212] px-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-medium text-gray-400">Step 2 of 3</div>
          <div className="text-xs font-medium text-indigo-400">67%</div>
        </div>
        <div className="w-full h-1 bg-[#242424] rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full w-[67%]"></div>
        </div>
      </div>

      {/* Main content container */}
      <div className="px-4 py-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">Your profile</h2>
          </div>
          <div className="flex items-center">
            <div className="w-12 h-6 bg-indigo-500 rounded-full p-0.5 transition-colors duration-300">
              <div className="w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 translate-x-6"></div>
            </div>
            <span className="text-sm ml-2 text-white">Show</span>
          </div>
        </div>

        {/* Profile Card Container - Styling the container but not touching the card itself */}
        <div className="rounded-2xl overflow-hidden border border-[#242424] bg-[#1A1A1A] p-6">
          {/* The profile card - unchanged */}
          <div className="relative">
            {/* Super Label - small and subtle */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-black/10 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-medium text-black/70 shadow-sm uppercase tracking-wider font-space-grotesk">
                Profile Card
              </div>
            </div>
            
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
                <div className="relative z-10 space-y-4 font-space-grotesk">
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
                          width={100}
                          height={100}
                          className="object-cover w-full h-full"
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
                            className={`w-full bg-transparent border-none focus:outline-none text-xl font-bold ${currentTheme.inputText} pl-1 font-space-grotesk`}
                            placeholder="yourname"
                            onBlur={() => setEditingField(null)}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className={`text-xl ${currentTheme.textColor}/70`}>@</span>
                          <span className="pl-1 font-bold">{profileData.username || "username"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <div 
                    className={`relative w-full text-center ${currentTheme.textColor} text-base bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.15)] cursor-pointer font-space-grotesk`}
                    onClick={() => setEditingField('bio')}
                  >
                    {editingField === 'bio' ? (
                      <input
                        type="text"
                        value={profileData.bio}
                        onChange={(e) => handleFieldEdit('bio', e.target.value)}
                        className={`w-full text-center bg-transparent border-none focus:outline-none ${currentTheme.inputText} font-space-grotesk`}
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
                        className={`px-3 py-1.5 rounded-lg ${currentTheme.textColor} text-sm flex items-center gap-1.5 bg-white/10 border border-white/10 font-space-grotesk`}
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
                        className={`px-3 py-1.5 rounded-lg bg-white/5 ${currentTheme.inputText} text-sm border border-dashed border-white/20 w-32 text-center font-space-grotesk`}
                        placeholder="#addhashtag"
                      />
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <div className={`text-lg font-semibold ${currentTheme.textColor} font-space-grotesk`}>
                          +0.0%
                        </div>
                        <div className={`text-xs ${currentTheme.textColor} uppercase tracking-wider font-space-grotesk`}>
                          Gain
                        </div>
                      </div>
                      <div className="text-center flex-1">
                        <div className={`text-lg font-semibold ${currentTheme.textColor} font-space-grotesk`}>
                          0%
                        </div>
                        <div className={`text-xs ${currentTheme.textColor} uppercase tracking-wider font-space-grotesk`}>
                          Win Rate
                        </div>
                      </div>
                      <div className="text-center flex-1">
                        <div className={`text-lg font-semibold ${currentTheme.textColor} font-space-grotesk`}>
                          0.0
                        </div>
                        <div className={`text-xs ${currentTheme.textColor} uppercase tracking-wider font-space-grotesk`}>
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
                    <div className={`text-sm font-bold ${currentTheme.textColor} font-space-grotesk`}>
                      Made with <span className="text-[#00E396]">#Tradr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ-like section styled after the Benefits in the reference image */}
        <div className="mt-10 mb-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">What you get</h2>
          </div>
          
          <div className="bg-[#1A1A1A] rounded-xl border border-[#242424] mb-3 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-indigo-500 w-5 h-5 flex items-center justify-center text-white">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-white font-medium">Personal trader profile</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1A1A1A] rounded-xl border border-[#242424] mb-3 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-indigo-500 w-5 h-5 flex items-center justify-center text-white">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-white font-medium">Performance stats tracking</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1A1A1A] rounded-xl border border-[#242424] mb-3 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-indigo-500 w-5 h-5 flex items-center justify-center text-white">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-white font-medium">Free shared profile link</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit your profile button */}
        <div className="mt-8 mb-6">
          <button
            className="w-full bg-indigo-500 text-white py-3.5 rounded-full font-medium shadow-sm hover:bg-indigo-600 transition-colors"
            onClick={handleContinue}
          >
            Edit your profile
          </button>
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