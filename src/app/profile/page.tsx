'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Check, X, Camera, Hash } from 'lucide-react';
import Image from 'next/image';

interface Step {
  id: string;
  title: string;
  subtitle: string;
  type: 'welcome' | 'auth' | 'username' | 'profile-pic' | 'bio' | 'hashtags';
}

interface FormData {
  email: string;
  username: string;
  bio: string;
  hashtags: string[];
  profilePic: string | null;
}

export default function ProfileBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    bio: '',
    hashtags: [],
    profilePic: null
  });
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps: Step[] = [
    {
      id: 'welcome',
      title: "Let's build your profile 🚀",
      subtitle: "Press Enter or click anywhere to continue",
      type: 'welcome'
    },
    {
      id: 'auth',
      title: 'First, choose how to continue',
      subtitle: 'Select your preferred login method',
      type: 'auth'
    },
    {
      id: 'username',
      title: 'Choose your username',
      subtitle: 'This is how others will find you',
      type: 'username'
    },
    {
      id: 'profile-pic',
      title: 'Add a profile picture',
      subtitle: 'Show the community who you are',
      type: 'profile-pic'
    },
    {
      id: 'bio',
      title: 'Tell us about yourself',
      subtitle: 'Keep it short and sweet',
      type: 'bio'
    },
    {
      id: 'hashtags',
      title: 'What are you interested in?',
      subtitle: 'Add up to 5 hashtags',
      type: 'hashtags'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  useEffect(() => {
    const element = document.getElementById(`step-${currentStep}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentStep]);

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
          {formData.profilePic ? (
            <Image
              src={formData.profilePic}
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

  const renderBioInput = () => (
    <div className="space-y-4">
      <textarea
        placeholder="Write a short bio..."
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
        rows={4}
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        onKeyPress={handleKeyPress}
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
      case 'bio':
        return renderBioInput();
      case 'hashtags':
        return renderHashtagInput();
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-white"
      onClick={handleNext}
    >
      <AnimatePresence mode="wait">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            id={`step-${index}`}
            className="min-h-screen flex flex-col items-center justify-center p-6"
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
                <h2 className="text-2xl md:text-3xl font-bold">{step.title}</h2>
                <p className="text-gray-600">{step.subtitle}</p>
              </motion.div>

              {renderStepContent(step)}

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