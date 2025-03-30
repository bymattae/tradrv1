'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProfileData {
  username: string;
  avatar: string | null;
  bio: string;
  tags: string[];
}

const SUGGESTED_TAGS = [
  '#ict', '#supplydemand', '#eurusd', '#nas100', '#smc', '#london',
  '#scalping', '#swing', '#daytrading', '#forex', '#crypto'
];

export default function ProfileBuilder() {
  const router = useRouter();
  const [step, setStep] = useState<'edit' | 'preview'>('edit');
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    avatar: null,
    bio: '',
    tags: [],
  });
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Validate form
    const isValidForm = 
      profileData.username.length >= 3 && 
      usernameAvailable === true &&
      profileData.bio.length >= 10 &&
      profileData.tags.length > 0;
    
    setIsValid(isValidForm);
  }, [profileData, usernameAvailable]);

  const checkUsername = (username: string) => {
    // Simulate API call
    setTimeout(() => {
      setUsernameAvailable(username.length >= 3);
    }, 500);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
    setProfileData({ ...profileData, username: value });
    if (value.length >= 3) {
      checkUsername(value);
    } else {
      setUsernameAvailable(null);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (profileData.tags.includes(tag)) {
      setProfileData({
        ...profileData,
        tags: profileData.tags.filter(t => t !== tag)
      });
    } else if (profileData.tags.length < 5) {
      setProfileData({
        ...profileData,
        tags: [...profileData.tags, tag]
      });
    }
  };

  const handleContinue = () => {
    if (step === 'edit' && isValid) {
      setStep('preview');
    } else if (step === 'preview') {
      // Store profile data
      localStorage.setItem('profileData', JSON.stringify(profileData));
      router.push('/onboarding/strategy');
    }
  };

  const handleBack = () => {
    if (step === 'preview') {
      setStep('edit');
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/strategy');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-4 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70">
        <button onClick={handleBack} className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1 rounded-full bg-purple-200 dark:bg-purple-800" />
          <div className={`w-16 h-1 rounded-full transition-colors ${
            step === 'preview' ? 'bg-purple-600 dark:bg-purple-400' : 'bg-purple-200 dark:bg-purple-800'
          }`} />
        </div>
        <button 
          className="text-sm font-medium text-purple-600 dark:text-purple-400"
          onClick={handleSkip}
        >
          Skip
        </button>
      </nav>

      <AnimatePresence mode="wait">
        {step === 'edit' ? (
          <motion.main
            key="edit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 p-6 max-w-xl mx-auto w-full"
          >
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Build your profile
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Let&apos;s create your public trading profile
                </p>
              </div>

              <div className="space-y-6">
                {/* Username Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose your @username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      @
                    </span>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={handleUsernameChange}
                      className="pl-8 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="tradername"
                    />
                    {usernameAvailable !== null && (
                      <div className={`mt-2 text-sm ${usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {usernameAvailable ? 'This username is available!' : 'Username is too short or unavailable'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Profile Picture
                  </label>
                  <div className="mt-1 flex items-center justify-center">
                    <button
                      type="button"
                      className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-purple-500 transition-colors"
                    >
                      {profileData.avatar ? (
                        <Image
                          src={profileData.avatar}
                          alt="Avatar"
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bio Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Supply & Demand | Funded Trader | Since 2019"
                    rows={3}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Keep it short and professional
                  </p>
                </div>

                {/* Tags Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Tags (Max 5)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          profileData.tags.includes(tag)
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleContinue}
                  disabled={!isValid}
                  className={`w-full py-4 rounded-2xl font-medium text-lg transition-all duration-200 flex items-center justify-center gap-2
                    ${isValid 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]' 
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}
                >
                  <span>Preview Profile</span>
                  {isValid && <Check className="w-5 h-5" />}
                </button>

                {!isValid && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-amber-600 dark:text-amber-400"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Please complete all required fields</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.main>
        ) : (
          <motion.main
            key="preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-6"
          >
            {/* Preview content */}
            <div className="max-w-xl mx-auto space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Preview your profile
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Looking good! Ready to continue?
                </p>
              </div>

              {/* Profile preview card */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-3xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden"
              >
                <div className="relative h-32 bg-gradient-to-r from-purple-500 to-indigo-500">
                  <div className="absolute -bottom-16 left-6">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                      {profileData.avatar ? (
                        <Image
                          src={profileData.avatar}
                          alt="Avatar"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-4xl">👤</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="pt-20 p-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {profileData.username ? `@${profileData.username}` : 'Your Username'}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {profileData.bio || 'Your trading journey starts here...'}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profileData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600">0%</div>
                      <div className="text-sm text-gray-600">Win Rate</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600">0</div>
                      <div className="text-sm text-gray-600">Trades</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <button 
                onClick={handleContinue}
                className="w-full py-4 rounded-2xl font-medium text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                         hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Continue to Strategy</span>
                <Check className="w-5 h-5" />
              </button>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
} 