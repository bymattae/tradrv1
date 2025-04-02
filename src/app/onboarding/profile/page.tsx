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

  return (
    <div className={`min-h-screen bg-black ${spaceGrotesk.variable} font-space-grotesk`}>
      {/* Simple header - matching reference */}
      <div className="bg-black p-3 border-b border-neutral-800 flex items-center">
        <div className="text-gray-400 text-xs">9:41 AM</div>
      </div>
      
      <div className="bg-black">
        {/* Simple navigation */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
          <Link href="/onboarding" className="text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="text-xs text-gray-400 flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded-md"
          >
            <Search className="w-3 h-3" />
            Live preview
          </button>
            </div>

        {/* Main content - simplified */}
        <div className="p-5">
          {/* Keep the profile card exactly as is */}
          <div className="max-w-sm mx-auto mb-5">
            <div className="rounded-2xl overflow-hidden">
              <div className={`relative w-full ${currentTheme.bgGradient} p-5 sm:p-6`}>
                {/* Enhanced metallic effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.4),transparent_40%,rgba(0,0,0,0.15))]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent_70%)]" />
                
                {/* Light reflective edge - enhanced */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50" />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black/15" />
                
                {/* Content with improved spacing - tightened spacing between sections */}
                <div className="relative z-10 space-y-4 font-space-grotesk">
                  {/* Username with Avatar - enhanced */}
                  <div className="relative">
                    <div className="absolute -top-2 left-2 z-10">
                      <span className="text-[10px] text-gray-400/50 font-medium tracking-wider lowercase font-light">username</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-[0_2px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:border-white/30 group hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                      {/* Profile Picture - enhanced */}
                      <div
                        className="relative h-14 w-14 rounded-full overflow-hidden border border-white/50 cursor-pointer flex-shrink-0 group/avatar shadow-md"
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
                          <div className="h-full w-full flex items-center justify-center bg-white/15">
                            <Camera className={`w-5 h-5 ${currentTheme.textColor} drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]`} />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-200 ease-in-out bg-black/30 backdrop-blur-sm transform group-hover/avatar:scale-100 scale-95">
                          <div className="flex flex-col items-center justify-center">
                            <Camera className="w-4 h-4 text-white mb-0.5" />
                            <span className="text-[10px] text-white font-medium">Upload</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Username with @ symbol and availability indicator - larger font */}
                      <div 
                        className={`flex-1 text-left ${currentTheme.textColor} text-[20px] font-bold cursor-pointer rounded-xl transition-colors group/username`}
                        onClick={() => setEditingField('username')}
                      >
                        {editingField === 'username' ? (
                          <div className="flex items-center relative">
                            <span className={`text-[20px] ${currentTheme.textColor}/70 font-bold`}>@</span>
                            <input
                              type="text"
                              value={profileData.username}
                              onChange={(e) => handleFieldEdit('username', e.target.value)}
                              className={`w-full bg-white/5 border-none focus:outline-none text-[20px] font-bold ${currentTheme.inputText} pl-1 caret-indigo-400 rounded-sm`}
                              placeholder="yourname"
                              onBlur={() => setEditingField(null)}
                              autoFocus
                            />
                            {profileData.username.length > 2 && (
                              <div className="absolute right-1">
                                {usernameAvailable ? 
                                  <Check className="w-5 h-5 text-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" /> : 
                                  <X className="w-5 h-5 text-red-500" />
                                }
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full group/edit">
                            <div className="flex items-center">
                              <span className={`text-[20px] ${currentTheme.textColor}/70 font-bold`}>@</span>
                              <span className="pl-1 font-bold">{profileData.username || "username"}</span>
                              {profileData.username.length > 2 && usernameAvailable && (
                                <div className="relative inline-flex ml-1">
                                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full animate-pulse-slow opacity-70"></div>
                                  <div className="relative bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full p-0.5">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                              )}
                            </div>
                            {profileData.username.length > 2 && !usernameAvailable && (
                              <div className="flex items-center gap-2">
                                <X className="w-5 h-5 text-red-500" />
                              </div>
                            )}
                            <div className="absolute right-4 opacity-0 group-hover:opacity-70 transition-opacity group-hover/edit:opacity-100">
                              <Pencil className="w-3.5 h-3.5 text-white/80 stroke-[1.5]" />
                            </div>
                          </div>
                        )}
                        {!profileData.username && !editingField && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 group/edit-icon">
                            <div className="bg-white/10 rounded-full p-1.5 backdrop-blur-md hover:bg-white/20 transition-all duration-200 shadow-sm">
                              <Pencil className="w-3.5 h-3.5 text-white stroke-[1.5]" />
                            </div>
                            <div className="absolute right-0 -top-8 transform translate-x-1/2 bg-black/80 text-white text-xs rounded-full px-2 py-0.5 opacity-0 group-hover/edit-icon:opacity-100 transition-opacity whitespace-nowrap">
                              Edit username
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bio - improved typography and contrast */}
                  <div className="relative">
                    <div className="absolute -top-2 left-2 z-10">
                      <span className="text-[10px] text-gray-400/50 font-medium tracking-wider lowercase font-light">bio</span>
                    </div>
                    <div 
                      className={`relative w-full text-center ${currentTheme.textColor} text-base bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 shadow-[0_2px_12px_rgba(0,0,0,0.15)] cursor-pointer group hover:border-white/30 transition-all duration-200 font-bold ${editingField === 'bio' ? 'ring-2 ring-indigo-400/50' : ''} hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)]`}
                      onClick={() => setEditingField('bio')}
                    >
                      {editingField === 'bio' ? (
                        <input
                          type="text"
                          value={profileData.bio}
                          onChange={(e) => handleFieldEdit('bio', e.target.value)}
                          className={`w-full text-center bg-white/5 border-none focus:outline-none ${currentTheme.inputText} text-[16px] tracking-wide font-bold caret-indigo-400 rounded-sm`}
                          placeholder="Add a short trader bio..."
                          onBlur={() => setEditingField(null)}
                          autoFocus
                        />
                      ) : (
                        <>
                          <p className="text-[16px] tracking-wide">
                            {profileData.bio || (
                              <span className="opacity-70">Add a short trader bio...</span>
                            )}
                          </p>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"></div>
                        </>
                      )}
                      <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-70 transition-opacity duration-200">
                        <Pencil className="w-3 h-3 text-white/80 stroke-[1.5]" />
                      </div>
                      {!profileData.bio && !editingField && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 group/edit-icon">
                          <div className="bg-white/10 rounded-full p-1.5 backdrop-blur-md hover:bg-white/20 transition-all duration-200 shadow-sm">
                            <Pencil className="w-3.5 h-3.5 text-white stroke-[1.5]" />
                          </div>
                          <div className="absolute right-0 -top-8 transform translate-x-1/2 bg-black/80 text-white text-xs rounded-full px-2 py-0.5 opacity-0 group-hover/edit-icon:opacity-100 transition-opacity whitespace-nowrap">
                            Edit bio
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Tags - improved typography and contrast */}
                  <div className="relative">
                    <div className="absolute -top-2 left-2 z-10">
                      <span className="text-[10px] text-gray-400/50 font-medium tracking-wider lowercase font-light">hashtags</span>
                    </div>
                    <div className={`flex flex-wrap justify-center gap-2 p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-[0_2px_12px_rgba(0,0,0,0.15)] group ${showTagInput ? 'ring-2 ring-indigo-400/50' : ''} hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:border-white/30 transition-all duration-200`}>
                      {profileData.tags.map((tag, index) => (
                        <div
                          key={index}
                          className={`px-3 py-1.5 rounded-lg ${currentTheme.textColor} text-[16px] tracking-wide flex items-center gap-1.5 bg-white/20 border border-white/20 hover:bg-white/25 transition-colors duration-200 font-bold shadow-sm`}
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
                          onChange={(e) => {
                            setNewTag(e.target.value);
                            setShowTagInput(true);
                          }}
                          onFocus={() => setShowTagInput(true)}
                          onBlur={() => setShowTagInput(false)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newTag.trim()) {
                              handleAddTag();
                              setNewTag('');
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg bg-white/5 ${currentTheme.inputText} text-[16px] tracking-wide border border-dashed border-white/30 w-36 text-center hover:border-white/50 focus:border-white/50 transition-colors duration-200 font-bold shadow-sm caret-indigo-400`}
                          placeholder="#addhashtag"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Stats - with tooltips - improved typography - stacked vertically */}
                  <div className="relative">
                    <div className="absolute -top-2 left-2 z-10">
                      <span className="text-[10px] text-gray-400/50 font-medium tracking-wider lowercase font-light">stats</span>
                    </div>
                    <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-[0_2px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:border-white/30 transition-all duration-200 space-y-2.5">
                      {/* Gain Stat */}
                      <div className="relative group p-2.5 bg-white/5 rounded-lg border border-white/10 transition-all duration-200 hover:bg-white/10">
                        <div className="flex items-center justify-between">
                          <div className={`text-xs ${currentTheme.textColor} uppercase tracking-tight font-bold`}>
                            Gain
                            <span className="ml-0.5 opacity-70"><Info className="w-2.5 h-2.5 inline" /></span>
                          </div>
                          <div className={`text-[18px] font-bold ${currentTheme.textColor}`}>
                            +0.0%
                          </div>
                        </div>
                        <div className="absolute -top-8 left-0 bg-black/90 text-white text-xs rounded px-2 py-1 w-36 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                          Your overall portfolio performance
                        </div>
                      </div>
                      
                      {/* Win Rate Stat */}
                      <div className="relative group p-2.5 bg-white/5 rounded-lg border border-white/10 transition-all duration-200 hover:bg-white/10">
                        <div className="flex items-center justify-between">
                          <div className={`text-xs ${currentTheme.textColor} uppercase tracking-tight font-bold`}>
                            Win Rate
                            <span className="ml-0.5 opacity-70"><Info className="w-2.5 h-2.5 inline" /></span>
                          </div>
                          <div className={`text-[18px] font-bold ${currentTheme.textColor}`}>
                            0%
                          </div>
                        </div>
                        <div className="absolute -top-8 left-0 bg-black/90 text-white text-xs rounded px-2 py-1 w-36 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                          Percentage of winning trades
                        </div>
                      </div>
                      
                      {/* Risk-Reward Stat */}
                      <div className="relative group p-2.5 bg-white/5 rounded-lg border border-white/10 transition-all duration-200 hover:bg-white/10">
                        <div className="flex items-center justify-between">
                          <div className={`text-xs ${currentTheme.textColor} uppercase tracking-tight font-bold`}>
                            Avg R:R
                            <span className="ml-0.5 opacity-70"><Info className="w-2.5 h-2.5 inline" /></span>
                          </div>
                          <div className={`text-[18px] font-bold ${currentTheme.textColor}`}>
                            0.0
                          </div>
                        </div>
                        <div className="absolute -top-8 left-0 bg-black/90 text-white text-xs rounded px-2 py-1 w-36 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                          Average risk-to-reward ratio
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Theme Selection - interactive hover preview - improved spacing and interaction */}
                  <div className="relative">
                    <div className="absolute -top-2 left-2 z-10">
                      <span className="text-[10px] text-gray-400/50 font-medium tracking-wider lowercase font-light">theme</span>
                    </div>
                    <div className="flex justify-center gap-3 pt-4 pb-2">
                      {THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setProfileData({ ...profileData, theme: theme.id })}
                          onMouseEnter={() => profileData.theme !== theme.id && setProfileData({ ...profileData, theme: theme.id })}
                          onMouseLeave={() => profileData.theme !== theme.id && setProfileData({ ...profileData, theme: currentTheme.id })}
                          className={`relative w-11 h-11 rounded-full overflow-hidden transition-all duration-200 hover:scale-110 hover:shadow-[0_0_12px_rgba(255,255,255,0.3)] ${
                            profileData.theme === theme.id ? 'ring-2 ring-white scale-115 shadow-[0_0_15px_rgba(255,255,255,0.4)] z-10' : ''
                          }`}
                        >
                          <div className={`absolute inset-0 ${theme.bgGradient}`} />
                          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
                          {profileData.theme === theme.id && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white/40 rounded-full p-1.5">
                                <Check className="w-4 h-4 text-white drop-shadow-md" />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer - simplified and consistent with brand */}
                  <div className="pt-1 text-center">
                    <div className={`text-xs font-medium ${currentTheme.textColor}/60`}>
                      powered by tradr
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Add soft shadow to entire profile card */}
            <div className="absolute inset-0 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] -z-10"></div>
          </div>
          
          {/* Simplified sharing section - pill-style container */}
          <div className="flex items-center justify-between bg-neutral-900/50 border border-neutral-800/50 rounded-full px-4 py-2.5 mb-5 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-neutral-400 text-sm font-medium">tradr.co/{profileData.username || "username"}</span>
            </div>
            <button 
              onClick={handleCopyLink}
              className="text-neutral-500 hover:text-neutral-300 transition-colors p-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              {showCopied && (
                <div className="absolute transform -translate-y-8 bg-green-600/90 text-white text-xs rounded-full px-2 py-0.5">
                  Copied
                </div>
              )}
            </button>
          </div>
          
          {/* Continue button - simplified */}
          <button
            className="w-full bg-neutral-100 text-black py-3 rounded-md font-medium"
            onClick={handleContinue}
          >
            Continue
          </button>
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
  );
}