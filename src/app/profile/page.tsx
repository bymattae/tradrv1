'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Check, X, Camera, Hash, User, Trophy, Star, TrendingUp, Target, Zap, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface Step {
  id: string;
  title: string;
  subtitle: string;
  type: 'welcome' | 'auth' | 'username' | 'profile-pic' | 'bio' | 'hashtags' | 'trading-style';
  xpReward?: number;
}

interface TradingStyle {
  riskLevel: number;
  experience: 'beginner' | 'intermediate' | 'advanced';
  preferredPairs: string[];
}

interface FormData {
  email: string;
  username: string;
  avatar: string | null;
  bio: string;
  hashtags: string[];
  tradingStyle: TradingStyle;
  totalXp: number;
}

function ProfilePreview({ data }: { data: FormData }) {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-xp-badge">
          <Trophy size={16} className="text-yellow-300" />
          <span className="text-white text-sm">{data.totalXp || 0} XP</span>
        </div>
        <div className="profile-avatar">
          {data.avatar ? (
            <img src={data.avatar} alt={data.username} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">👤</span>
          )}
        </div>
      </div>
      <div className="profile-content">
        <h3 className="text-xl font-bold">{data.username || 'Your Username'}</h3>
        <p className="text-gray-600 mt-2">{data.bio || 'Your trading journey starts here...'}</p>
        
        <div className="profile-stats">
          <div className="profile-stat-card">
            <div className="flex items-center gap-2 text-purple-600">
              <Target size={16} />
              <span className="text-sm font-medium">Risk Level</span>
            </div>
            <p className="mt-1 text-sm">
              {data.tradingStyle?.riskLevel ? `${data.tradingStyle.riskLevel}/10` : 'Not set'}
            </p>
          </div>
          <div className="profile-stat-card">
            <div className="flex items-center gap-2 text-purple-600">
              <Star size={16} />
              <span className="text-sm font-medium">Experience</span>
            </div>
            <p className="mt-1 text-sm capitalize">
              {data.tradingStyle?.experience || 'Not set'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {data.hashtags?.map((tag, i) => (
            <span key={i} className="profile-hashtag">
              <TrendingUp size={12} />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfileBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    avatar: null,
    bio: '',
    hashtags: [],
    tradingStyle: {
      riskLevel: 5,
      experience: 'beginner',
      preferredPairs: [],
    },
    totalXp: 0,
  });
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps: Step[] = [
    {
      id: 'welcome',
      title: "Welcome to TRADR! 🚀",
      subtitle: "Let's build your trading profile",
      type: 'welcome',
      xpReward: 50
    },
    {
      id: 'auth',
      title: 'Join the Trading League 🏆',
      subtitle: 'Choose your preferred login method',
      type: 'auth',
      xpReward: 50
    },
    {
      id: 'username',
      title: 'Choose Your Identity 🎭',
      subtitle: 'Pick a unique username that represents you',
      type: 'username',
      xpReward: 100
    },
    {
      id: 'profile-pic',
      title: 'Show Your Style 🎨',
      subtitle: 'Upload a profile picture that stands out',
      type: 'profile-pic',
      xpReward: 150
    },
    {
      id: 'trading-style',
      title: 'Tell Your Story 📝',
      subtitle: 'Share your trading journey and goals',
      type: 'trading-style',
      xpReward: 200
    },
    {
      id: 'bio',
      title: 'Define Your Strategy 📊',
      subtitle: 'Set your risk level and trading experience',
      type: 'bio',
      xpReward: 250
    },
    {
      id: 'hashtags',
      title: 'Add Your Tags #️⃣',
      subtitle: 'Choose hashtags that describe your trading style',
      type: 'hashtags',
      xpReward: 300
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const xpReward = steps[currentStep]?.xpReward || 0;
      setFormData(prev => ({
        ...prev,
        totalXp: prev.totalXp + xpReward
      }));
      setCurrentStep(prev => prev + 1);
    }
  };

  const renderAuthButtons = () => (
    <div className="space-y-4">
      <AuthButton 
        icon="/icons/google.svg" 
        label="Continue with Google" 
        onClick={() => console.log('Google auth')} 
      />
      <AuthButton 
        icon="/icons/apple.svg" 
        label="Continue with Apple" 
        onClick={() => console.log('Apple auth')} 
      />
      <AuthButton 
        icon="/icons/facebook.svg" 
        label="Continue with Facebook" 
        onClick={() => console.log('Facebook auth')} 
      />
      <AuthButton 
        icon="/icons/email.svg" 
        label="Continue with Email" 
        onClick={() => console.log('Email auth')} 
      />
    </div>
  );

  const renderUsernameInput = () => (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="@username"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          value={formData.username}
          onChange={(e) => {
            setFormData({ ...formData, username: e.target.value });
            setIsChecking(true);
            // Simulate username check
            setTimeout(() => {
              setUsernameAvailable(e.target.value.length > 3);
              setIsChecking(false);
            }, 500);
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isChecking ? (
            <motion.div 
              className="w-5 h-5 border-2 border-blue-500 rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : usernameAvailable ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <X className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>
    </div>
  );

  const renderProfilePicUpload = () => (
    <div className="space-y-4">
      <div className="relative w-32 h-32 mx-auto">
        <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
          {formData.avatar ? (
            <Image
              src={formData.avatar}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <Camera className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <button 
          className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
          onClick={() => console.log('Upload photo')}
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderTradingStyle = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Risk Level</label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.tradingStyle.riskLevel}
          onChange={(e) => setFormData({
            ...formData,
            tradingStyle: {
              ...formData.tradingStyle,
              riskLevel: parseInt(e.target.value)
            }
          })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Conservative 🐢</span>
          <span>Balanced 🎯</span>
          <span>Aggressive 🚀</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Experience Level</label>
        <div className="grid grid-cols-3 gap-2">
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFormData(prev => ({
                ...prev,
                tradingStyle: {
                  ...prev.tradingStyle,
                  experience: level
                }
              }))}
              className={`experience-button ${
                formData.tradingStyle.experience === level 
                  ? 'experience-button-active' 
                  : 'experience-button-inactive'
              }`}
            >
              {level === 'beginner' && '🌱 '}
              {level === 'intermediate' && '⚡ '}
              {level === 'advanced' && '🏆 '}
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBioInput = () => (
    <div className="space-y-4">
      <textarea
        placeholder="Write a short bio..."
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
        rows={4}
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
      />
    </div>
  );

  const renderHashtagInput = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {formData.hashtags.map((tag, i) => (
          <div key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
            <Hash className="w-4 h-4" />
            {tag}
            <button onClick={() => setFormData({ 
              ...formData, 
              hashtags: formData.hashtags.filter((_, index) => index !== i) 
            })}>
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a hashtag and press Enter"
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value) {
            e.preventDefault();
            if (formData.hashtags.length < 5) {
              setFormData({
                ...formData,
                hashtags: [...formData.hashtags, e.currentTarget.value]
              });
              e.currentTarget.value = '';
            }
          }
        }}
      />
    </div>
  );

  const renderStepContent = (step: Step) => {
    switch (step.type) {
      case 'auth':
        return renderAuthButtons();
      case 'username':
        return renderUsernameInput();
      case 'profile-pic':
        return renderProfilePicUpload();
      case 'trading-style':
        return renderTradingStyle();
      case 'bio':
        return renderBioInput();
      case 'hashtags':
        return renderHashtagInput();
      default:
        return null;
    }
  };

  const renderConfirmButton = (step: Step) => (
    <motion.button
      className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium flex items-center gap-2 hover:from-purple-600 hover:to-indigo-600 transition-all mx-auto shadow-lg"
      whileHover={{ scale: 1.02, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={handleNext}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      Looks good! {step.xpReward && `(+${step.xpReward} XP)`} <Check className="w-4 h-4" />
    </motion.button>
  );

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <AnimatePresence mode="wait">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            id={`step-${index}`}
            className="min-h-screen flex flex-col items-center p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="max-w-lg w-full space-y-6">
              <motion.div
                className="text-center space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                  {step.title}
                </h2>
                <p className="text-gray-600">{step.subtitle}</p>
                {step.xpReward && (
                  <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    <Star className="w-4 h-4" fill="currentColor" />
                    Complete for {step.xpReward} XP
                  </div>
                )}
              </motion.div>

              {renderStepContent(step)}
              
              {step.type !== 'welcome' && <ProfilePreview data={formData} />}
              
              {step.type !== 'welcome' && renderConfirmButton(step)}

              {index < steps.length - 1 && (
                <motion.div
                  className="absolute bottom-8 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface AuthButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

function AuthButton({ icon, label, onClick }: AuthButtonProps) {
  return (
    <motion.button
      className="w-full px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
    >
      <Image
        src={icon}
        alt={icon}
        width={20}
        height={20}
      />
      {label}
    </motion.button>
  );
} 