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
          
          {/* Live Preview Button */}
          <div className="group relative ml-2">
            <button 
              onClick={() => setIsPreviewOpen(true)}
              className="px-2.5 py-1 rounded-full text-xs font-medium text-gray-300 border border-gray-700 bg-[#181818] hover:bg-[#242424] hover:border-gray-600 transition-all duration-200"
            >
              Live preview
            </button>
            <div className="absolute right-0 -bottom-8 transform translate-y-2 bg-black/90 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              See how your card looks in public
            </div>
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
          Create your Tradr
        </h1>
        <p className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-600 mb-3">
          Make it beautiful ✨
        </p>
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
                <div className="relative z-10 space-y-4 font-space-grotesk">
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

        {/* Sharing Box */}
        <div className="mt-5 rounded-xl bg-gradient-to-b from-[#1E1E1E] to-[#151515] p-4 border border-[#242424] shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <LinkIcon className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-300 font-medium">tradr.co/{profileData.username || "username"}</span>
            </div>
            <button 
              onClick={handleCopyLink}
              className="text-gray-400 hover:text-white transition-colors relative group"
            >
              <Copy className="w-4 h-4" />
              <div className="absolute right-0 -top-8 transform translate-x-1/2 bg-black/90 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Copy link
              </div>
              {showCopied && (
                <div className="absolute right-0 -top-8 transform translate-x-1/2 bg-black/90 text-white text-xs rounded px-2 py-1">
                  Copied!
                </div>
              )}
            </button>
          </div>
          
          <div className="flex justify-around items-center">
            {/* Social Icons */}
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#242424] text-gray-300 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#242424] text-gray-300 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#242424] text-gray-300 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5401 6.42C21.8868 6.70496 21.1939 6.89141 20.4802 6.97C21.2249 6.53105 21.7866 5.83376 22.0541 5.02C21.3574 5.42788 20.5989 5.71661 19.8082 5.87C19.2635 5.29385 18.5546 4.90393 17.7799 4.75943C17.0052 4.61494 16.2051 4.72263 15.4929 5.06592C14.7807 5.40921 14.1938 5.96932 13.8252 6.67213C13.4565 7.37493 13.3258 8.18372 13.4502 8.97C11.9385 8.89958 10.4599 8.53255 9.10322 7.8942C7.74652 7.25584 6.53321 6.36197 5.5401 5.26C5.22773 5.80867 5.06695 6.42825 5.06999 7.06C5.06999 8.29 5.7001 9.38 6.6401 10.02C6.07345 10.0034 5.51949 9.84825 5.0301 9.57V9.62C5.0309 10.4281 5.31046 11.2133 5.82707 11.8442C6.34368 12.4751 7.06708 12.9165 7.8701 13.1C7.34522 13.242 6.79729 13.264 6.2601 13.164C6.47807 13.8587 6.91719 14.4722 7.51276 14.9158C8.10834 15.3595 8.82739 15.6119 9.5701 15.634C8.32772 16.6147 6.80276 17.1443 5.2301 17.142C4.94414 17.1426 4.65836 17.1247 4.3751 17.088C5.9726 18.1311 7.82801 18.6802 9.7251 18.678C13.8651 18.678 16.1401 15.274 16.1401 12.292C16.1401 12.13 16.1361 11.968 16.1291 11.81C16.8283 11.3164 17.4404 10.7053 17.9351 10.002C17.1756 10.3383 16.3729 10.5591 15.5501 10.656C16.4045 10.1213 17.0395 9.29897 17.3401 8.346L22.5401 6.42Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#242424] text-gray-300 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 8V13C16 13.9319 16.3688 14.8252 17.0251 15.4815C17.6813 16.1377 18.5745 16.5065 19.5064 16.5065C20.4383 16.5065 21.3315 16.1377 21.9877 15.4815C22.644 14.8252 23.0128 13.9319 23.0128 13V12C23.0064 9.82833 22.2365 7.7242 20.8123 6.1307C19.3881 4.5372 17.4298 3.56036 15.2695 3.39168C13.1092 3.22301 10.9751 3.87612 9.2597 5.20883C7.5443 6.54153 6.38218 8.4489 6.00326 10.5791C5.62435 12.7093 6.05206 14.8996 7.1994 16.7293C8.34673 18.559 10.1251 19.8946 12.2078 20.4664C14.2905 21.0383 16.5347 20.8048 18.456 19.8126C20.3772 18.8204 21.8476 17.1348 22.56 15.09" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#242424] text-gray-300 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.5 3.5L3.5 10.5L9.5 13.5M20.5 3.5L17.5 20.5L9.5 13.5M20.5 3.5L9.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.5 13.5V18.5L12.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Continue button - yellow to match design */}
        <div className="mt-6 mb-6">
          <button
            className="w-full bg-[#FCFF52] text-black py-3.5 rounded-full font-bold text-lg shadow-lg hover:bg-[#EAED4E] transition-colors relative overflow-hidden group"
            onClick={handleContinue}
          >
            <span className="relative z-10">Looks good!</span>
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