'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, X, Link as LinkIcon, Sparkles, Lock, Shield, Copy, Trophy, Star, Tags, BadgeCheck, Sparkle, Zap, Target, Flame, Share, Share2, Info, Download, TrendingUp, Percent, Wallet, Palette, ChevronDown, Plus, Moon, Sun, Pencil, Search, LineChart, AlertCircle, User, Signal as SignalIcon, Wifi as WifiIcon, Battery as BatteryIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { LucideIcon } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
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
  const [editingField, setEditingField] = useState<'username' | 'bio' | 'tag' | 'tags' | 'theme' | null>(null);
  const [newTag, setNewTag] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [profileStrength, setProfileStrength] = useState(0);
  const [showCopied, setShowCopied] = useState(false);
  const [showXPAnimation, setShowXPAnimation] = useState<{ amount: number; isVisible: boolean }>({ amount: 0, isVisible: false });
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [activeEditDrawer, setActiveEditDrawer] = useState<'username' | 'bio' | 'tags' | 'theme' | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
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
  const [helperText, setHelperText] = useState<string>('tap any field to edit your profile.');
  const [currentTip, setCurrentTip] = useState('customize your profile to make it stand out.');

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
    navigator.clipboard.writeText(`www.tradr.co/${profileData.username}`);
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

  // Update the getHelperTextForField function with a tip for theme selection
  const getHelperTextForField = (field: string | null) => {
    switch(field) {
      case 'username':
        return 'your username is public — make it unique and memorable.';
      case 'bio':
        return 'write like it\'s your Twitter bio — short and spicy.';
      case 'tag':
        return 'add tags that match your trading style or niche.';
      case 'theme':
        return 'this will be used for your card + share image.';
      default:
        return 'tap any field to edit your profile.';
    }
  };
  
  // Add a function to handle tag input with space/comma delimiters
  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const lastChar = value[value.length - 1];
    
    // If ends with space or comma, treat as tag submission
    if ((lastChar === ' ' || lastChar === ',') && value.trim().length > 1) {
      const newTagValue = value.slice(0, -1).trim();
      if (newTagValue && profileData.tags.length < 5) {
        // Add tag with emoji
        const emoji = '📈';
        const formattedTag = `${emoji} ${newTagValue}`;
        
        // Check if tag doesn't already exist
        if (!profileData.tags.includes(formattedTag)) {
          setProfileData(prev => ({
            ...prev,
            tags: [...prev.tags, formattedTag]
          }));
        }
        
        // Clear input
        setNewTag('');
      }
    } else {
      setNewTag(value);
    }
  };

  // Handle field focus to show appropriate tip
  useEffect(() => {
    switch(editingField) {
      case 'username': 
        setCurrentTip(getHelperTextForField('username'));
        break;
      case 'bio': 
        setCurrentTip(getHelperTextForField('bio'));
        break;
      case 'tag': 
        setCurrentTip(getHelperTextForField('tag'));
        break;
      case 'theme': 
        setCurrentTip(getHelperTextForField('theme'));
        break;
      default:
        setCurrentTip(getHelperTextForField(null));
    }
  }, [editingField]);

  const handleSaveField = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setActiveEditDrawer(null);
    }, 1000);
  };

  return (
    <div className={`min-h-screen bg-[#0a0a0e] text-gray-200 ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-space-grotesk`}>
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <Link href="/onboarding" className="text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-medium">Profile Editor</h1>
        <div className="w-5"></div> {/* Empty div for flex spacing */}
      </header>

      {/* Updating toast notification */}
      <AnimatePresence>
        {isUpdating && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-800/90 text-purple-300 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm text-sm font-medium flex items-center gap-2"
          >
            <span className="animate-pulse">●</span>
            Live preview updating...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - full-screen profile preview */}
      <div className="container max-w-7xl mx-auto p-6">
        {/* Live Preview */}
        <div className="w-full flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Live Profile Preview</h2>
          </div>
          <div className="text-sm text-purple-300/80 mb-4">{currentTip}</div>
          
          {/* Phone mockup container */}
          <div className="bg-black rounded-[40px] p-3 shadow-xl mx-auto w-[330px] border border-gray-800">
            {/* Status bar */}
            <div className="flex justify-between items-center px-4 h-6 text-xs text-gray-400">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4"><SignalIcon className="w-full h-full" /></div>
                <div className="w-4 h-4"><WifiIcon className="w-full h-full" /></div>
                <div className="w-4 h-4"><BatteryIcon className="w-full h-full" /></div>
              </div>
            </div>
            
            {/* Phone screen content */}
            <div 
              className={`bg-[#121218] rounded-[32px] overflow-hidden shadow-inner h-[600px] flex flex-col relative
                        ${editingField === 'username' ? 'ring-2 ring-purple-500/50' : ''}
                        ${editingField === 'bio' ? 'ring-2 ring-purple-500/50' : ''}
                        ${editingField === 'tags' ? 'ring-2 ring-purple-500/50' : ''}
                        ${editingField === 'theme' ? 'ring-2 ring-purple-500/50' : ''}`}
            >
              {/* Profile header */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-100" />
                  </div>
                  <span className="font-semibold">Profile</span>
                </div>
                <Share2 className="w-5 h-5 text-gray-400" />
              </div>
              
              {/* Profile card */}
              <div className={`m-4 p-5 rounded-2xl shadow-lg bg-black/60 backdrop-filter backdrop-blur-sm border border-gray-800
                               ${editingField ? 'shadow-[0_0_20px_rgba(139,92,246,0.15)]' : ''}`}>
                {/* Avatar & Username */}
                <div className="flex items-center gap-3 mb-4 relative group">
                  <div 
                    className="w-16 h-16 rounded-full bg-gray-800 relative overflow-hidden flex items-center justify-center text-gray-500 cursor-pointer transition-transform transform hover:scale-105"
                    onClick={handleAvatarClick}
                  >
                    {profileData.avatar ? (
                      <Image src={profileData.avatar} alt="Avatar" layout="fill" objectFit="cover" />
                    ) : (
                      <User className="w-8 h-8" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="flex-grow relative">
                    <div className={`text-lg leading-tight ${currentTheme.textColor}`}>
                      <span className="opacity-60">@</span>{profileData.username}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Trophy className="w-3 h-3 mr-1" />
                      <span>Level 1 Trader</span>
                    </div>
                    <button 
                      className="absolute -right-1 top-0 p-1 opacity-70 hover:opacity-100 transition-opacity"
                      onClick={() => setActiveEditDrawer('username')}
                    >
                      <Pencil className="w-3.5 h-3.5 text-purple-400" />
                    </button>
                  </div>
                </div>
                
                {/* Bio */}
                <div className="mb-4 text-sm leading-relaxed relative group">
                  {profileData.bio || "No bio yet..."}
                  <button 
                    className="absolute right-0 top-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setActiveEditDrawer('bio')}
                  >
                    <Pencil className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4 relative group">
                  {profileData.tags.map((tag, i) => (
                    <div key={i} className={`px-2 py-1 rounded-md text-xs ${currentTheme.textColor} bg-gray-800/70`}>
                      {tag}
                    </div>
                  ))}
                  {profileData.tags.length === 0 && (
                    <div className="text-xs text-gray-500">No tags yet...</div>
                  )}
                  <button 
                    className="absolute right-0 top-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setActiveEditDrawer('tags')}
                  >
                    <Pencil className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-800/70 p-2 rounded-md">
                    <div className="text-xs text-gray-400">Gain</div>
                    <div className={`text-md font-jetbrains font-medium ${currentTheme.textColor}`}>
                      {profileData.stats.performance.toFixed(2)}%
                    </div>
                  </div>
                  <div className="bg-gray-800/70 p-2 rounded-md">
                    <div className="text-xs text-gray-400">Win Rate</div>
                    <div className={`text-md font-jetbrains font-medium ${currentTheme.textColor}`}>
                      {profileData.stats.winRate.toFixed(2)}%
                    </div>
                  </div>
                  <div className="bg-gray-800/70 p-2 rounded-md">
                    <div className="text-xs text-gray-400">Avg R:R</div>
                    <div className={`text-md font-jetbrains font-medium ${currentTheme.textColor}`}>
                      {profileData.stats.maxDD.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Theme selector/indicator */}
                <div className="relative group">
                  <div className="flex justify-center gap-2">
                    {THEMES.map((theme) => (
                      <div 
                        key={theme.id}
                        className={`w-6 h-6 rounded-full ${theme.bgGradient} 
                                   ${profileData.theme === theme.id ? 'ring-2 ring-white scale-110' : 'opacity-60'}`}
                      />
                    ))}
                  </div>
                  <button 
                    className="absolute right-0 top-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setActiveEditDrawer('theme')}
                  >
                    <Pencil className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                </div>
                
                {/* Powered by text */}
                <div className="text-center mt-3 text-xs text-gray-500">
                  powered by tradr
                </div>
              </div>
            </div>
          </div>
          
          {/* Main CTA button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition shadow-lg shadow-purple-900/30 inline-flex items-center justify-center"
            >
              Save Changes
              <Check className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Sliding Bottom Drawer */}
      <AnimatePresence>
        {activeEditDrawer && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setActiveEditDrawer(null)}
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md rounded-t-2xl shadow-lg border border-gray-800 border-b-0 max-h-[70vh] overflow-auto"
            >
              <div className="flex justify-center py-2">
                <div className="w-10 h-1 bg-gray-700 rounded-full"></div>
              </div>
              
              <div className="p-6">
                {activeEditDrawer === 'username' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Edit Username</h3>
                    <div className="flex">
                      <div className="bg-gray-800 px-3 flex items-center border-r border-gray-700 rounded-l-md">
                        <span className="text-gray-400">@</span>
                      </div>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => {
                          setProfileData({...profileData, username: e.target.value});
                          setUsernameAvailable(true);
                        }}
                        className="bg-gray-800 text-gray-200 rounded-r-md py-3 px-3 w-full border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="username"
                        autoFocus
                      />
                    </div>
                    {!usernameAvailable && (
                      <p className="text-red-500 text-xs">Username is not available</p>
                    )}
                    <button
                      onClick={handleSaveField}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition shadow-lg"
                    >
                      Save Username
                    </button>
                  </div>
                )}
                
                {activeEditDrawer === 'bio' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Edit Bio</h3>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="bg-gray-800 text-gray-200 rounded-md py-3 px-3 w-full h-28 border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                      placeholder="Write a short trader bio..."
                      autoFocus
                    />
                    <button
                      onClick={handleSaveField}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition shadow-lg"
                    >
                      Save Bio
                    </button>
                  </div>
                )}
                
                {activeEditDrawer === 'tags' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Edit Tags</h3>
                    <div className="bg-gray-800 rounded-md border border-gray-700 p-3">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {profileData.tags.map((tag, i) => (
                          <div key={i} className="bg-gray-700 text-gray-300 px-2 py-1 rounded flex items-center space-x-1">
                            <span>{tag}</span>
                            <button
                              onClick={() => handleTagToggle(tag)}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={newTag}
                        onChange={handleTagInput}
                        className="bg-transparent text-gray-300 w-full border-none focus:outline-none mt-2"
                        placeholder="Type hashtag and press space"
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-gray-500">Limited to 5 tags</p>
                    <button
                      onClick={handleSaveField}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition shadow-lg"
                    >
                      Save Tags
                    </button>
                  </div>
                )}
                
                {activeEditDrawer === 'theme' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Choose Theme</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setProfileData({...profileData, theme: theme.id})}
                          className={`relative p-4 rounded-md flex items-center justify-center transition-all 
                                     ${theme.bgGradient} ${profileData.theme === theme.id ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}
                        >
                          {profileData.theme === theme.id && (
                            <div className="absolute -top-1 -right-1 bg-white text-black rounded-full p-0.5">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                          <Palette className="w-6 h-6 text-white" />
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleSaveField}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition shadow-lg"
                    >
                      Save Theme
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Confetti would be triggered here */}
        </div>
      )}
    </div>
  );
}

// Just for the mockup - we'd import these from Lucide in a real app
function SignalIcon({className = "w-6 h-6"}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 12.5v-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M8 18h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 12.5v-2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.5 12.5v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function WifiIcon({className = "w-6 h-6"}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor"/>
      <path d="M5 12.5c3.5-3.5 10.5-3.5 14 0M8.5 9c2-2 5-2 7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BatteryIcon({className = "w-6 h-6"}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 10v4M11 10v4M15 10v4M22 12h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}