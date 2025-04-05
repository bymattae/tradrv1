'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, X, Link as LinkIcon, Sparkles, Lock, Shield, Copy, Trophy, Star, Tags, BadgeCheck, Sparkle, Zap, Target, Flame, Share, Share2, Info, Download, TrendingUp, Percent, Wallet, Palette, ChevronDown, Plus, Moon, Sun, Pencil, Search, LineChart, AlertCircle, User, CircleDot, Gem, FlowerIcon, CircleIcon, HeartIcon, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

// Add SF Pro Display font styles
const styles = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontFeatureSettings: '"ss01", "ss02", "ss03"'
};

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
    inputText: 'text-black',
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
    inputText: 'text-black',
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

// Update the verified badge component
const VerifiedBadge = () => (
  <span className="ml-1.5 bg-blue-500/10 text-blue-400 text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 tracking-tight">
    <Check className="w-3 h-3" />
    <span className="relative top-[0.5px]">Verified</span>
  </span>
);

export default function ProfileBuilder() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [editingField, setEditingField] = useState<'username' | 'bio' | 'tag' | 'tags' | 'theme' | null>(null);
  const [newTag, setNewTag] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<'available' | 'unavailable' | 'checking' | null>(null);
  const [justSaved, setJustSaved] = useState<string | null>(null);
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
      performance: 0,
      winRate: 0,
      maxDD: 0
    },
    hasConnectedStrategy: false,
    verifiedAccounts: {
      live: 0,
      funded: 0,
    },
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showHolo, setShowHolo] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<TagSuggestion[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();
  const [helperText, setHelperText] = useState<string>('tap any field to edit your profile.');
  const [currentTip, setCurrentTip] = useState('customize your profile to make it stand out.');
  const [showSavedAnimation, setShowSavedAnimation] = useState(false);
  const [usernameInputFocused, setUsernameInputFocused] = useState(false);
  const [bioInputFocused, setBioInputFocused] = useState(false);
  const [tagInputFocused, setTagInputFocused] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [firstBioSave, setFirstBioSave] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showLevelUpToast, setShowLevelUpToast] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isUsernameVerified, setIsUsernameVerified] = useState(false);

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
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }, [profileData, checklist, showConfetti]);

  useEffect(() => {
    // Simulate username availability check
    if (profileData.username.length >= 3) {
      setUsernameStatus('checking');
      const timer = setTimeout(() => {
        // For demonstration, assume most usernames are available except "taken"
        const isAvailable = profileData.username.toLowerCase() !== 'taken';
        setUsernameAvailable(isAvailable);
        setUsernameStatus(isAvailable ? 'available' : 'unavailable');
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUsernameStatus(null);
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
    if (newTag && profileData.tags.length < 3) {
      const formattedTag = newTag.toLowerCase();
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
    navigator.clipboard.writeText(`tradr.co/@${profileData.username}`);
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
    if (profileData.tags.length < 3) {
      const formattedTag = suggestion.text;
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
  
  // Simplified tag input handler
  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
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

  // Add a bio character limit
  const bioCharLimit = 120;

  // Bio hints that rotate - update with requested hints
  const bioHints = [
    "describe your style in a sentence.",
    "keep it short, catchy, and bold.",
    "think of it like your IG bio."
  ];

  // Rotate hints for bio
  useEffect(() => {
    if (activeEditDrawer === 'bio') {
      const interval = setInterval(() => {
        setHintIndex((prevIndex) => (prevIndex + 1) % bioHints.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeEditDrawer]);

  // Generate username suggestions
  const generateUsernameSuggestions = () => {
    // Simple suggestion algorithm - in production this would be more sophisticated
    const prefixes = ['trader', 'fx', 'crypto', 'bull', 'bear'];
    const suffixes = ['pro', 'master', 'wizard', 'shark', 'guru'];
    
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    
    return [
      `${randomPrefix}${randomSuffix}`,
      `${randomPrefix}${randomNum}`
    ];
  };

  // Handle username suggestion click
  const handleSuggestUsername = () => {
    const suggestions = generateUsernameSuggestions();
    setUsernameSuggestions(suggestions);
  };

  // Page animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0 }
  };

  // Card animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        delay: 0.2
      } 
    }
  };

  // Staggered item animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  // Update username save handling to set verified status
  const handleSaveField = () => {
    setIsUpdating(true);
    setJustSaved(activeEditDrawer);
    setShowSavedAnimation(true);
    
    // Add verification badge for username
    if (activeEditDrawer === 'username' && profileData.username.length >= 3) {
      setIsUsernameVerified(true);
    }
    
    // Check for first bio save
    if (activeEditDrawer === 'bio' && firstBioSave && profileData.bio.trim().length > 0) {
      setFirstBioSave(false);
      setShowLevelUpToast(true);
      setTimeout(() => setShowLevelUpToast(false), 3000);
    }
    
    // Play sound if enabled
    if (soundEnabled) {
      // Sound would be played here
    }
    
    setTimeout(() => {
      setShowSavedAnimation(false);
      setIsUpdating(false);
      setActiveEditDrawer(null);
    }, 1200);
    
    // Clear the justSaved state after 3 seconds
    setTimeout(() => {
      setJustSaved(null);
    }, 3000);
  };

  // Add typing detection for bio animation
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= bioCharLimit) {
      setProfileData({...profileData, bio: e.target.value});
      
      // Set typing state to true
      setIsTyping(true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to turn off typing state after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Update tags with animation
  const handleTagAddWithAnimation = () => {
    if (newTag && profileData.tags.length < 3) {
      const formattedTag = newTag.toLowerCase();
      setProfileData(prev => ({
        ...prev,
        tags: [...prev.tags, formattedTag]
      }));
      setNewTag('');
    }
  };

  // Handle tag keydown - updated to use the animated version
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim() && profileData.tags.length < 3) {
      handleTagAddWithAnimation();
    }
  };

    return (
            <motion.div 
      className="min-h-screen bg-[#0a0a0e] text-gray-200"
      style={styles}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Header with SF Pro Display */}
      <motion.header 
        className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-black shadow-lg"
        style={styles}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href="/onboarding" className="text-white hover:text-gray-300 transition flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wide">Back</span>
        </Link>
        
        {/* Step indicators moved to header */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        </div>
      </motion.header>

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

      {/* Main content */}
      <div className="container max-w-2xl mx-auto px-6 py-12">
        {/* Centered header with more space above - simplified styling */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-medium text-white mb-2 tracking-tight">
            Build your profile
          </h1>
          <p className="text-lg text-gray-400 font-medium tracking-tight">Make it beautiful.</p>
        </motion.div>
        
        {/* Profile card - clean styling */}
        <motion.div 
          className={`w-full mx-auto p-5 rounded-xl shadow-lg ${currentTheme.bgGradient} backdrop-filter backdrop-blur-sm border ${currentTheme.borderColor} mb-6`}
          variants={cardVariants}
          initial="initial"
          animate="animate"
        >
          {/* Avatar & Username - adjusted sizing */}
          <div className="flex items-center gap-3 mb-4 relative border border-gray-700/30 p-3 rounded-lg">
            <div 
              className="w-14 h-14 rounded-full bg-gray-800 relative overflow-hidden flex items-center justify-center text-gray-500 cursor-pointer transition-transform transform hover:scale-105"
              onClick={handleAvatarClick}
            >
              {profileData.avatar ? (
                <Image 
                  src={profileData.avatar as string} 
                  alt="Avatar" 
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-4 h-4 text-white" />
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
              <div className={`text-base font-medium leading-tight ${currentTheme.textColor} flex items-center gap-2`}>
                <span className="opacity-60">@</span>{profileData.username || "username"}
                {isUsernameVerified && <VerifiedBadge />}
                {justSaved === 'username' && (
                  <Check className={`w-3.5 h-3.5 ${currentTheme.id === 'gold' || currentTheme.id === 'rose-gold' || currentTheme.id === 'lavender' ? 'text-black' : 'text-white'}`} />
                )}
              </div>
              <div className="text-xs text-gray-500 flex items-center mt-1">
                <span className={currentTheme.id === 'black' || currentTheme.id === 'space-grey' ? 'text-white' : 'text-black'}>
                  tradr.co/@{profileData.username || "username"}
                </span>
                <Copy 
                  className={`w-3 h-3 ml-1 cursor-pointer hover:opacity-80 ${currentTheme.id === 'black' || currentTheme.id === 'space-grey' ? 'text-white' : 'text-black'}`} 
                  onClick={handleCopyLink} 
                />
                {showCopied && <span className="ml-1 text-green-400 text-2xs">copied!</span>}
              </div>
              <button 
                className={`absolute -right-1 top-0 p-1 opacity-70 hover:opacity-100 transition-opacity rounded-full 
                         ${currentTheme.id === 'gold' || currentTheme.id === 'rose-gold' ? 'bg-white/20' : 'bg-black/20'}`}
                onClick={() => setActiveEditDrawer('username')}
              >
                <Pencil className={`w-3 h-3 ${currentTheme.id === 'gold' || currentTheme.id === 'rose-gold' ? 'text-black' : 'text-white'}`} />
              </button>
            </div>
          </div>

          {/* Bio - adjusted space */}
          <div className="mb-4 text-sm leading-relaxed relative border border-gray-700/30 p-3 rounded-lg">
            <div className={`${currentTheme.textColor} font-medium`}>
              {profileData.bio || "Write your bio"}
                </div>
            <button 
              className={`absolute right-2 top-2 p-1 opacity-70 hover:opacity-100 transition-opacity rounded-full
                         ${currentTheme.id === 'gold' || currentTheme.id === 'rose-gold' ? 'bg-white/20' : 'bg-black/20'}`}
              onClick={() => setActiveEditDrawer('bio')}
            >
              <Pencil className={`w-3 h-3 ${currentTheme.id === 'gold' || currentTheme.id === 'rose-gold' ? 'text-black' : 'text-white'}`} />
            </button>
              </div>
          
          {/* Tags - adjusted space */}
          <div className="flex flex-wrap gap-2 mb-4 relative border border-gray-700/30 p-3 rounded-lg">
            {profileData.tags.map((tag, i) => (
              <div key={i} className={`px-2 py-1 rounded-md text-xs font-medium ${currentTheme.textColor} ${currentTheme.inputBg} flex items-center`}>
                {tag}
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="ml-1 text-gray-400 hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
                </div>
            ))}
            {profileData.tags.length < 3 && (
              <button 
                onClick={() => setActiveEditDrawer('tags')} 
                className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 ${currentTheme.inputBg} ${currentTheme.textColor} font-medium`}
              >
                <Plus className="w-3 h-3" /> Add hashtag
              </button>
            )}
            <button 
              className={`absolute right-2 top-2 p-1 opacity-70 hover:opacity-100 transition-opacity rounded-full
                         ${currentTheme.id === 'gold' || currentTheme.id === 'rose-gold' ? 'bg-white/20' : 'bg-black/20'}`}
              onClick={() => setActiveEditDrawer('tags')}
            >
              <Pencil className={`w-3 h-3 ${currentTheme.id === 'gold' || currentTheme.id === 'rose-gold' ? 'text-black' : 'text-white'}`} />
            </button>
          </div>
          
          {/* Stats - adjusted space */}
          <div className="grid grid-cols-3 gap-2 mb-3 border border-gray-700/30 p-3 rounded-lg relative group">
            <div className="absolute inset-0 w-full h-full bg-black/10 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-help z-10">
              <div className="bg-gray-900/90 text-white text-xs px-2 py-1 rounded shadow-lg max-w-[90%] text-center">
                You can add your strategy in the next step
              </div>
            </div>
            <div className={`${currentTheme.inputBg} p-2 rounded-md`}>
              <div className={`text-2xs ${currentTheme.inputText}`}>Gain</div>
              <div className={`text-sm font-jetbrains font-medium ${currentTheme.inputText}`}>
                {profileData.stats.performance.toFixed(2)}%
                  </div>
            </div>
            <div className={`${currentTheme.inputBg} p-2 rounded-md`}>
              <div className={`text-2xs ${currentTheme.inputText}`}>Win Rate</div>
              <div className={`text-sm font-jetbrains font-medium ${currentTheme.inputText}`}>
                {profileData.stats.winRate.toFixed(2)}%
                  </div>
                </div>
            <div className={`${currentTheme.inputBg} p-2 rounded-md`}>
              <div className={`text-2xs ${currentTheme.inputText}`}>Avg R:R</div>
              <div className={`text-sm font-jetbrains font-medium ${currentTheme.inputText}`}>
                {profileData.stats.maxDD.toFixed(2)}
              </div>
              </div>
            </div>
        </motion.div>

        {/* Theme selector with cleaner spacing */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-wrap justify-center gap-3">
            {THEMES.map((theme) => (
              <motion.button
                key={theme.id}
                className={`relative w-12 h-12 rounded-full overflow-hidden group ${
                  profileData.theme === theme.id ? 'ring-2 ring-white ring-opacity-50' : ''
                }`}
                onClick={() => setProfileData({...profileData, theme: theme.id})}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`absolute inset-0 ${theme.bgGradient}`} />
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        {/* Buttons with clean styling */}
        <div className="flex gap-4">
          <motion.button
            onClick={handlePreviewShare}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium tracking-tight text-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Preview
          </motion.button>
          <motion.button
            onClick={handleContinue}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium tracking-tight text-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue
          </motion.button>
        </div>
            </div>

      {/* Add Level Up Toast notification */}
      <AnimatePresence>
        {showLevelUpToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-purple-900/90 text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm text-sm font-medium flex items-center gap-2"
          >
            <span className="text-yellow-300 text-lg">✨</span>
            <div>
              <span className="font-bold">Level 1 Badge Unlocked!</span>
              <div className="text-xs text-purple-200">Your bio is ready to shine</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sliding Bottom Drawer - Updated with cleaner styling */}
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
            
            {/* Drawer - Updated with cleaner styling */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0e] backdrop-blur-md rounded-t-2xl shadow-lg border border-gray-800 border-b-0 max-h-[70vh] overflow-auto"
            >
              <div className="flex justify-center py-2">
                <div className="w-10 h-1 bg-gray-700 rounded-full"></div>
              </div>
              
              <div className="p-6">
                {activeEditDrawer === 'username' && (
                  <div className="space-y-4">
                    <div className="pb-3 mb-3 border-b border-gray-800/80">
                      <h3 className="text-xl font-semibold text-white tracking-tight">Claim your handle</h3>
                      <p className="text-[#C5C5C5] text-sm mt-1 font-normal">your profile link will be tradr.co/<span className="text-blue-400">{profileData.username || 'username'}</span></p>
                    </div>
                    
                    <div className="relative group">
                      <div className="flex">
                        <div className="bg-gray-800 px-3 flex items-center border-r border-gray-700 rounded-l-md">
                          <span className="text-gray-400">@</span>
                        </div>
                        <input
                          type="text"
                          value={profileData.username}
                          onChange={(e) => {
                            setProfileData({...profileData, username: e.target.value});
                          }}
                          onFocus={() => setUsernameInputFocused(true)}
                          onBlur={() => setUsernameInputFocused(false)}
                          className={`bg-gray-800 text-gray-200 rounded-r-md py-4 px-4 w-full border border-gray-700 focus:outline-none transition-all duration-300 ${
                            usernameInputFocused ? 'ring-2 ring-blue-500/50 border-blue-500' : ''
                          }`}
                          placeholder="username"
                          autoFocus
                        />
                      </div>
                      
                      <div className="mt-3 flex justify-between items-center">
                        <div>
                          {usernameStatus === 'checking' && (
                            <div className="text-yellow-400 text-xs flex items-center">
                              <span className="animate-pulse">●</span>
                              <span className="ml-1">checking availability...</span>
                            </div>
                          )}
                          {usernameStatus === 'available' && (
                            <div className="text-green-400 text-xs flex items-center">
                              <Check className="w-3.5 h-3.5 mr-1" />
                              <span>@{profileData.username} is available — nice pick!</span>
                            </div>
                          )}
                          {usernameStatus === 'unavailable' && (
                            <div className="text-red-400 text-xs flex items-center">
                              <X className="w-3.5 h-3.5 mr-1" />
                              <span>@{profileData.username} is taken — try another one</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={handleSuggestUsername}
                          className="text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded transition-all"
                        >
                          <span role="img" aria-label="lightbulb">💡</span> suggest
                        </button>
                      </div>

                      {usernameSuggestions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 bg-gray-800/40 p-3 rounded-md">
                          {usernameSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setProfileData({...profileData, username: suggestion});
                              }}
                              className="text-xs bg-purple-900/50 hover:bg-purple-800/70 px-3 py-1.5 rounded transition-all text-purple-300"
                            >
                              @{suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <motion.button
                      onClick={handleSaveField}
                      disabled={usernameStatus === 'unavailable' || profileData.username.length < 3}
                      className={`w-full font-medium py-3 px-4 rounded-md transition-all shadow-lg overflow-hidden relative ${
                        usernameStatus === 'unavailable' || profileData.username.length < 3
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-500'
                      }`}
                      whileTap={{ scale: 0.98 }}
                      whileHover={
                        usernameStatus !== 'unavailable' && profileData.username.length >= 3
                          ? { boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }
                          : {}
                      }
                    >
                      {usernameStatus !== 'unavailable' && profileData.username.length >= 3 && (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "0%" }}
                          transition={{ duration: 0.4 }}
                        />
                      )}
                      
                      <span className="relative z-10">
                        {showSavedAnimation ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center"
                          >
                            <Check className="w-5 h-5 mr-2" />
                            <span>saved!</span>
                          </motion.div>
                        ) : (
                          'save changes'
                        )}
                      </span>
                    </motion.button>

                    <div className="flex justify-end items-center mt-2">
                      <div className="group relative">
                        <button 
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-all ${
                            soundEnabled ? 'text-blue-400 bg-blue-900/30' : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {soundEnabled ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                              <line x1="23" y1="9" x2="17" y2="15" />
                              <line x1="17" y1="9" x2="23" y2="15" />
                            </svg>
                          )}
                          <span>sound</span>
                        </button>
                        <div className="absolute bottom-full right-0 mb-2 w-40 text-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded p-2 pointer-events-none">
                          click sounds: {soundEnabled ? 'on' : 'off'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeEditDrawer === 'bio' && (
                  <div className="space-y-4">
                    <div className="pb-3 mb-3 border-b border-gray-800/80">
                      <h3 className="text-xl font-semibold text-white">Craft your trader bio</h3>
                      <p className="text-[#C5C5C5] text-sm mt-1">keep it sharp — this is your badge.</p>
                    </div>

                    <div className="relative group">
                      <textarea
                        value={profileData.bio}
                        onChange={handleBioChange}
                        onFocus={() => setBioInputFocused(true)}
                        onBlur={() => setBioInputFocused(false)}
                        className={`bg-gray-800 text-gray-200 rounded-md py-4 px-4 w-full h-32 border border-gray-700 focus:outline-none resize-none transition-all duration-300 ${
                          bioInputFocused ? 'ring-2 ring-blue-500/50 border-blue-500' : ''
                        }`}
                        placeholder="write your bio"
                        autoFocus
                      />
                      
                      {/* Typing animation border */}
                      {isTyping && (
                        <motion.div 
                          className="absolute bottom-0 left-0 h-[2px] bg-blue-500"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.2 }}
                        />
                      )}
                      
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-gray-800/80 px-2 py-1 rounded">
                        {profileData.bio.length}/{bioCharLimit}
                      </div>
                    </div>

                    <motion.div
                      key={hintIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.5 }}
                      className="text-sm text-[#999] bg-gray-800/30 p-3 rounded-md border border-gray-700/50 italic"
                    >
                      {bioHints[hintIndex]}
                    </motion.div>

                    <motion.button
                      onClick={handleSaveField}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-md transition-all shadow-lg relative overflow-hidden group"
                      whileTap={{ scale: 0.98 }}
                      whileHover={{
                        boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                      }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.4 }}
                      />
                      
                      <span className="relative z-10">
                        {showSavedAnimation ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center"
                          >
                            <Check className="w-5 h-5 mr-2" />
                            <span>saved!</span>
                          </motion.div>
                        ) : (
                          'save changes'
                        )}
                      </span>
                    </motion.button>

                    <div className="flex justify-end items-center mt-2">
                      <div className="group relative">
                        <button 
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-all ${
                            soundEnabled ? 'text-blue-400 bg-blue-900/30' : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {soundEnabled ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                              <line x1="23" y1="9" x2="17" y2="15" />
                              <line x1="17" y1="9" x2="23" y2="15" />
                            </svg>
                          )}
                          <span>sound</span>
                        </button>
                        <div className="absolute bottom-full right-0 mb-2 w-40 text-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded p-2 pointer-events-none">
                          click sounds: {soundEnabled ? 'on' : 'off'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeEditDrawer === 'tags' && (
                  <div className="space-y-4">
                    <div className="pb-3 mb-3 border-b border-gray-800/80">
                      <h3 className="text-xl font-semibold text-white">Add your hashtags</h3>
                      <p className="text-[#C5C5C5] text-sm mt-1">Only 3 hashtags allowed</p>
                    </div>

                    <div className="bg-gray-800 rounded-md border border-gray-700 p-4">
                      <div className="flex flex-wrap gap-2 mb-3 min-h-[48px]">
                        <AnimatePresence>
                          {profileData.tags.map((tag, i) => (
                            <motion.div 
                              key={tag}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="bg-blue-900/30 text-blue-200 px-3 py-1.5 rounded-md flex items-center space-x-1 border border-blue-800/30"
                              layout
                            >
                              <span className="mr-1">#{tag}</span>
                              <button
                                onClick={() => handleTagToggle(tag)}
                                className="text-blue-400 hover:text-red-400 ml-1 p-0.5 rounded-full hover:bg-gray-700/50"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      {profileData.tags.length < 3 && (
                        <div className="relative mt-2">
                          <input
                            type="text"
                            value={newTag}
                            onChange={handleTagInput}
                            onKeyDown={handleTagKeyDown}
                            onFocus={() => setTagInputFocused(true)}
                            onBlur={() => setTagInputFocused(false)}
                            className={`bg-gray-800 text-gray-200 rounded-md py-3 px-4 w-full border border-gray-700 focus:outline-none transition-all duration-300 ${
                              tagInputFocused ? 'ring-2 ring-blue-500/50 border-blue-500' : ''
                            }`}
                            placeholder="type and press enter to add"
                            autoFocus
                          />
                          <button
                            onClick={handleTagAddWithAnimation}
                            disabled={!newTag.trim()}
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-all ${
                              newTag.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 cursor-not-allowed'
                            }`}
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-[#C5C5C5] mt-2 flex items-center justify-center bg-gray-800/40 py-2 px-3 rounded-md">
                      <span className="mr-1">press</span>
                      <span className="bg-blue-900/40 px-2 py-0.5 rounded text-blue-300 font-mono">Enter</span>
                      <span className="ml-1">to add a hashtag</span>
                    </div>

                    <motion.button
                      onClick={handleSaveField}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-md transition-all shadow-lg relative overflow-hidden group"
                      whileTap={{ scale: 0.98 }}
                      whileHover={{
                        boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                      }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.4 }}
                      />
                      
                      <span className="relative z-10">
                        {showSavedAnimation ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center"
                          >
                            <Check className="w-5 h-5 mr-2" />
                            <span>saved!</span>
                          </motion.div>
                        ) : (
                          'save changes'
                        )}
                      </span>
                    </motion.button>

                    <div className="flex justify-end items-center mt-2">
                      <div className="group relative">
                        <button 
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-all ${
                            soundEnabled ? 'text-blue-400 bg-blue-900/30' : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {soundEnabled ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                              <line x1="23" y1="9" x2="17" y2="15" />
                              <line x1="17" y1="9" x2="23" y2="15" />
                            </svg>
                          )}
                          <span>sound</span>
                        </button>
                        <div className="absolute bottom-full right-0 mb-2 w-40 text-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded p-2 pointer-events-none">
                          click sounds: {soundEnabled ? 'on' : 'off'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeEditDrawer === 'theme' && (
                  <div className="space-y-4">
                    <div className="pb-3 mb-3 border-b border-gray-800/80">
                      <h3 className="text-xl font-semibold text-white">Choose your theme</h3>
                      <p className="text-[#C5C5C5] text-sm mt-1">pick a color that defines your style.</p>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-3 p-2">
                      {THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setProfileData({...profileData, theme: theme.id})}
                          className={`relative w-12 h-12 rounded-full transition-all 
                                     ${theme.bgGradient} ${profileData.theme === theme.id ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                        />
                      ))}
                    </div>

                    <div className="text-xs text-[#C5C5C5] mt-2 flex items-center justify-center bg-gray-800/40 py-2 px-3 rounded-md">
                      tap a theme to see it in your profile preview
                    </div>

                    <motion.button
                      onClick={handleSaveField}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-md transition-all shadow-lg relative overflow-hidden group"
                      whileTap={{ scale: 0.98 }}
                      whileHover={{
                        boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                      }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.4 }}
                      />
                      
                      <span className="relative z-10">
                        {showSavedAnimation ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center"
                          >
                            <Check className="w-5 h-5 mr-2" />
                            <span>saved!</span>
                          </motion.div>
                        ) : (
                          'save changes'
                        )}
                      </span>
                    </motion.button>

                    <div className="flex justify-end items-center mt-2">
                      <div className="group relative">
                        <button 
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-all ${
                            soundEnabled ? 'text-blue-400 bg-blue-900/30' : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {soundEnabled ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                              <line x1="23" y1="9" x2="17" y2="15" />
                              <line x1="17" y1="9" x2="23" y2="15" />
                            </svg>
                          )}
                          <span>sound</span>
                        </button>
                        <div className="absolute bottom-full right-0 mb-2 w-40 text-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded p-2 pointer-events-none">
                          click sounds: {soundEnabled ? 'on' : 'off'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50"
              onClick={() => setIsPreviewOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-6"
              style={styles}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-[380px]">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[15px] text-white/80 font-medium">Live Preview</div>
                  <button 
                    onClick={() => setIsPreviewOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-white/80" />
                  </button>
                </div>
                <div className="rounded-[32px] overflow-hidden bg-[#0A0A0A] shadow-2xl">
                  <div className="p-8 space-y-7">
                    {/* Avatar and username section */}
                    <div className="space-y-5">
                      <div className="w-[88px] h-[88px] rounded-full bg-[#141414] flex items-center justify-center overflow-hidden">
                        {profileData.avatar ? (
                          <Image 
                            src={profileData.avatar} 
                            alt="Avatar" 
                            width={88} 
                            height={88}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-white opacity-50" />
                        )}
                      </div>
                      <div>
                        <div className="text-[28px] text-white flex items-center gap-2 font-medium">
                          @{profileData.username || "username"}
                          {isUsernameVerified && <VerifiedBadge />}
                        </div>
                        <div className="text-[15px] text-[#666666] mt-1">
                          tradr.co/@{profileData.username || "username"}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="text-[17px] text-white leading-[1.4]">
                      {profileData.bio || "Your bio will appear here..."}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {profileData.tags.map((tag, i) => (
                        <div 
                          key={i} 
                          className="px-4 py-[6px] rounded-[12px] text-[15px] font-medium bg-[#141414] text-white"
                        >
                          #{tag}
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-[28px] font-medium text-white">
                          {profileData.stats.performance}%
                        </div>
                        <div className="text-[13px] text-[#666666] mt-1">
                          Gain
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[28px] font-medium text-white">
                          {profileData.stats.winRate}%
                        </div>
                        <div className="text-[13px] text-[#666666] mt-1">
                          Win Rate
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[28px] font-medium text-white">
                          {profileData.stats.maxDD}%
                        </div>
                        <div className="text-[13px] text-[#666666] mt-1">
                          Avg R:R
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Just for the mockup - we'd import these from Lucide in a real app
function CustomSignalIcon({className = "w-6 h-6"}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 12.5v-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M8 18h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 12.5v-2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.5 12.5v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CustomWifiIcon({className = "w-6 h-6"}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor"/>
      <path d="M5 12.5c3.5-3.5 10.5-3.5 14 0M8.5 9c2-2 5-2 7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CustomBatteryIcon({className = "w-6 h-6"}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 10v4M11 10v4M15 10v4M22 12h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}