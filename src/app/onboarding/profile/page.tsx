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
      {/* Status bar - mobile style */}
      <div className="sticky top-0 z-50 bg-[#121212] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center text-gray-300 text-sm font-medium">
          9:41
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="text-gray-300">
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M16.5 0.666656H1.5C0.671574 0.666656 0 1.33823 0 2.16666V11.8333C0 12.6618 0.671574 13.3333 1.5 13.3333H16.5C17.3284 13.3333 18 12.6618 18 11.8333V2.16666C18 1.33823 17.3284 0.666656 16.5 0.666656ZM1.5 11.8333V2.16666H16.5V11.8333H1.5Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="text-gray-300">
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.24999 4.66666C3.21694 4.66666 3.99999 3.88361 3.99999 2.91666C3.99999 1.94971 3.21694 1.16666 2.24999 1.16666C1.28304 1.16666 0.5 1.94971 0.5 2.91666C0.5 3.88361 1.28304 4.66666 2.24999 4.66666Z" fill="currentColor"/>
              <path d="M5.5 2.91669H17.5V2.91669C17.5 2.45646 17.1269 2.08335 16.6667 2.08335H6.33333C5.8731 2.08335 5.5 2.45646 5.5 2.91669V2.91669Z" fill="currentColor"/>
              <path d="M5.5 7.00002H17.5V7.00002C17.5 6.53979 17.1269 6.16669 16.6667 6.16669H6.33333C5.8731 6.16669 5.5 6.53979 5.5 7.00002V7.00002Z" fill="currentColor"/>
              <path d="M5.5 11.0833H17.5V11.0833C17.5 10.6231 17.1269 10.25 16.6667 10.25H6.33333C5.8731 10.25 5.5 10.6231 5.5 11.0833V11.0833Z" fill="currentColor"/>
              <path d="M2.24999 12.8333C3.21694 12.8333 3.99999 12.0503 3.99999 11.0833C3.99999 10.1164 3.21694 9.33335 2.24999 9.33335C1.28304 9.33335 0.5 10.1164 0.5 11.0833C0.5 12.0503 1.28304 12.8333 2.24999 12.8333Z" fill="currentColor"/>
              <path d="M2.24999 8.75C3.21694 8.75 3.99999 7.96695 3.99999 7C3.99999 6.03305 3.21694 5.25 2.24999 5.25C1.28304 5.25 0.5 6.03305 0.5 7C0.5 7.96695 1.28304 8.75 2.24999 8.75Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="text-gray-300">
            <svg width="18" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 6H7c-3.3 0-6 2.7-6 6s2.7 6 6 6h10c3.3 0 6-2.7 6-6s-2.7-6-6-6z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M17 6c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" fill="currentColor"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Navigation with back button and dots */}
      <div className="bg-[#121212] px-5 py-4 flex items-center justify-between">
        <Link href="/onboarding" className="text-gray-300 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          <div className="w-2 h-2 rounded-full bg-[#242424]"></div>
        </div>
      </div>
      
      {/* Centered title and subtitle with improved hierarchy */}
      <div className="px-5 py-5 text-center">
        <h1 className="text-5xl font-black text-white tracking-tight mb-1">
          Your trader identity.
        </h1>
        <p className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-600 mb-3">
          Build it. Brand it. Show it off.
        </p>
        
        {/* Profile URL with copy icon */}
        <div className="inline-flex items-center bg-white/5 rounded-full px-3 py-1.5 border border-white/10 mt-4">
          <span className="text-sm text-gray-400">tradr.co/</span>
          <span className="text-sm text-indigo-400 font-medium">{profileData.username || "username"}</span>
          <button 
            onClick={handleCopyLink}
            className="ml-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          {showCopied && (
            <span className="absolute mt-8 bg-black/90 text-white text-xs rounded px-2 py-1 transition-opacity">
              Copied!
            </span>
          )}
        </div>
      </div>

      {/* Main content container */}
      <div className="px-4 py-3">
        {/* Profile Card Container - Styling the container but not touching the card itself */}
        <div className="rounded-2xl overflow-hidden border border-[#242424] bg-[#1A1A1A] p-6 mt-2 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
          {/* The profile card */}
          <div className="relative">            
            <div className="rounded-2xl overflow-hidden max-w-sm mx-auto">
              {/* Card background - enhanced metallic effects */}
              <div className={`relative w-full ${currentTheme.bgGradient} p-5 sm:p-6`}>
                {/* Enhanced metallic effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.4),transparent_40%,rgba(0,0,0,0.15))]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent_70%)]" />
                
                {/* Light reflective edge - enhanced */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50" />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black/15" />
                
                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Username with Avatar - enhanced */}
                  <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                    {/* Profile Picture - enhanced */}
                    <div
                      className="relative h-12 w-12 rounded-full overflow-hidden border border-white/40 cursor-pointer flex-shrink-0 group"
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
                          <Camera className={`w-5 h-5 ${currentTheme.textColor} drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]`} />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out bg-black/30 backdrop-blur-sm transform group-hover:scale-100 scale-95">
                        <div className="flex flex-col items-center justify-center">
                          <Camera className="w-4 h-4 text-white mb-0.5" />
                          <span className="text-[10px] text-white font-medium">Upload</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Username with @ symbol and availability indicator */}
                    <div 
                      className={`flex-1 text-left ${currentTheme.textColor} text-xl font-bold cursor-pointer rounded-xl transition-colors`}
                      onClick={() => setEditingField('username')}
                    >
                      {editingField === 'username' ? (
                        <div className="flex items-center">
                          <span className={`text-xl ${currentTheme.textColor}/70 font-bold`}>@</span>
                          <input
                            type="text"
                            value={profileData.username}
                            onChange={(e) => handleFieldEdit('username', e.target.value)}
                            className={`w-full bg-transparent border-none focus:outline-none text-xl font-bold ${currentTheme.inputText} pl-1`}
                            placeholder="yourname"
                            onBlur={() => setEditingField(null)}
                            autoFocus
                          />
                          {profileData.username.length > 2 && (
                            <div className="relative group">
                              {usernameAvailable ? 
                                <Check className="w-4 h-4 text-green-500 ml-1" /> : 
                                <X className="w-4 h-4 text-red-500 ml-1" />
                              }
                              <div className="absolute right-0 -top-8 transform translate-x-1/2 bg-black/90 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                {usernameAvailable ? 'Username available' : 'Username taken'}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <span className={`text-xl ${currentTheme.textColor}/70 font-bold`}>@</span>
                            <span className="pl-1 font-bold">{profileData.username || "username"}</span>
                          </div>
                          {profileData.username.length > 2 && (
                            <div className="relative group">
                              {usernameAvailable ? 
                                <Check className="w-4 h-4 text-green-500" /> : 
                                <X className="w-4 h-4 text-red-500" />
                              }
                              <div className="absolute right-0 -top-8 transform translate-x-1/2 bg-black/90 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                {usernameAvailable ? 'Username available' : 'Username taken'}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <div 
                    className={`relative w-full text-center ${currentTheme.textColor} text-base bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.15)] cursor-pointer group hover:border-white/30 transition-all duration-200 font-bold`}
                    onClick={() => setEditingField('bio')}
                  >
                    {editingField === 'bio' ? (
                      <input
                        type="text"
                        value={profileData.bio}
                        onChange={(e) => handleFieldEdit('bio', e.target.value)}
                        className={`w-full text-center bg-transparent border-none focus:outline-none ${currentTheme.inputText} font-bold`}
                        placeholder="Add a short trader bio..."
                        onBlur={() => setEditingField(null)}
                        autoFocus
                      />
                    ) : (
                      <>
                        {profileData.bio || "Add a short trader bio..."}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"></div>
                      </>
                    )}
                    <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
                      <Pencil className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap justify-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                    {profileData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className={`px-3 py-1.5 rounded-lg ${currentTheme.textColor} text-sm flex items-center gap-1.5 bg-white/10 border border-white/10 hover:bg-white/15 transition-colors duration-200 font-bold`}
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
                        className={`px-3 py-1.5 rounded-lg bg-white/5 ${currentTheme.inputText} text-sm border border-dashed border-white/20 w-32 text-center hover:border-white/40 focus:border-white/40 transition-colors duration-200 font-bold`}
                        placeholder="#addhashtag"
                      />
                    )}
                  </div>
                  
                  {/* Stats - with tooltips */}
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1 group relative">
                        <div className={`text-lg font-bold ${currentTheme.textColor}`}>
                          +0.0%
                        </div>
                        <div className={`text-xs ${currentTheme.textColor} uppercase tracking-wider flex items-center justify-center font-bold`}>
                          Gain
                          <span className="ml-0.5 opacity-70"><Info className="w-2.5 h-2.5" /></span>
                        </div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs rounded px-2 py-1 w-32 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          Your overall portfolio performance
                        </div>
                      </div>
                      <div className="text-center flex-1 group relative">
                        <div className={`text-lg font-bold ${currentTheme.textColor}`}>
                          0%
                        </div>
                        <div className={`text-xs ${currentTheme.textColor} uppercase tracking-wider flex items-center justify-center font-bold`}>
                          Win Rate
                          <span className="ml-0.5 opacity-70"><Info className="w-2.5 h-2.5" /></span>
                        </div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs rounded px-2 py-1 w-32 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          Percentage of winning trades
                        </div>
                      </div>
                      <div className="text-center flex-1 group relative">
                        <div className={`text-lg font-bold ${currentTheme.textColor}`}>
                          0.0
                        </div>
                        <div className={`text-xs ${currentTheme.textColor} uppercase tracking-wider flex items-center justify-center font-bold`}>
                          Avg R:R
                          <span className="ml-0.5 opacity-70"><Info className="w-2.5 h-2.5" /></span>
                        </div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs rounded px-2 py-1 w-32 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          Average risk-to-reward ratio
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Theme Selection - interactive hover preview */}
                  <div className="flex justify-center gap-2 pt-2">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setProfileData({ ...profileData, theme: theme.id })}
                        onMouseEnter={() => profileData.theme !== theme.id && setProfileData({ ...profileData, theme: theme.id })}
                        onMouseLeave={() => profileData.theme !== theme.id && setProfileData({ ...profileData, theme: currentTheme.id })}
                        className={`relative w-10 h-10 rounded-full overflow-hidden transition-all duration-200 hover:scale-110 ${
                          profileData.theme === theme.id ? 'ring-2 ring-white/70 scale-105' : ''
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
                  
                  {/* Profile URL display with copy */}
                  <div className="flex items-center justify-center p-2 px-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.15)] cursor-pointer group hover:bg-white/15 transition-all" onClick={handleCopyLink}>
                    <LinkIcon className={`w-3.5 h-3.5 ${currentTheme.textColor} mr-2`} />
                    <span className={`text-sm ${currentTheme.textColor} font-bold`}>tradr.co/{profileData.username || "username"}</span>
                    <div className="ml-auto relative">
                      <Copy className={`w-3.5 h-3.5 ${currentTheme.textColor}/70 group-hover:${currentTheme.textColor}`} />
                      <div className="absolute right-0 -top-8 transform translate-x-1/2 bg-black/90 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Copy link
                      </div>
                    </div>
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

        {/* Progress Quest indicator */}
        <div className="mt-6 mb-3 px-2">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">Quest Progress</div>
            <div className="text-xs text-indigo-400 font-medium">4/10</div>
          </div>
          <div className="mt-1.5 bg-[#242424] h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{width: '40%'}}></div>
          </div>
          <div className="mt-1 text-xs text-gray-500">Step 4: Personalize your identity</div>
        </div>

        {/* Continue button - more rewarding language */}
        <div className="mt-5 mb-6">
          <button
            className="w-full bg-[#FCFF52] text-black py-3.5 rounded-full font-bold text-lg shadow-lg hover:bg-[#EAED4E] transition-colors relative overflow-hidden group"
            onClick={handleContinue}
          >
            <span className="relative z-10">Launch my profile</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FCFF52]/0 via-white/20 to-[#FCFF52]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
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