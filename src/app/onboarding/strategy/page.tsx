'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChartLine, Info, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface StrategyData {
  name: string;
  description: string;
  tags: string[];
  platform: 'mt4' | 'mt5' | null;
  credentials: {
    username: string;
    password: string;
  };
}

const STRATEGY_TAGS = [
  '#scalping', '#swing', '#daytrading',
  '#forex', '#crypto', '#indices',
  '#london', '#ny', '#asia',
  '#technical', '#fundamental', '#price-action'
];

export default function StrategySetup() {
  const router = useRouter();
  const [step, setStep] = useState<'strategy' | 'connect'>('strategy');
  const [strategyData, setStrategyData] = useState<StrategyData>({
    name: '',
    description: '',
    tags: [],
    platform: null,
    credentials: {
      username: '',
      password: ''
    }
  });
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Validate form based on current step
    if (step === 'strategy') {
      setIsValid(strategyData.name.length >= 3);
    } else {
      setIsValid(
        !!strategyData.platform &&
        strategyData.credentials.username.length > 0 &&
        strategyData.credentials.password.length > 0
      );
    }
  }, [step, strategyData]);

  const handleTagToggle = (tag: string) => {
    if (strategyData.tags.includes(tag)) {
      setStrategyData({
        ...strategyData,
        tags: strategyData.tags.filter(t => t !== tag)
      });
    } else if (strategyData.tags.length < 5) {
      setStrategyData({
        ...strategyData,
        tags: [...strategyData.tags, tag]
      });
    }
  };

  const handleContinue = () => {
    if (step === 'strategy' && isValid) {
      setStep('connect');
    } else if (step === 'connect' && isValid) {
      // Store strategy data
      localStorage.setItem('strategyData', JSON.stringify(strategyData));
      router.push('/onboarding/success');
    }
  };

  const handleBack = () => {
    if (step === 'connect') {
      setStep('strategy');
    } else {
      router.push('/onboarding/profile');
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-4 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70">
        <button onClick={handleBack} className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1 rounded-full bg-purple-600 dark:bg-purple-400" />
          <div className={`w-16 h-1 rounded-full transition-colors ${
            step === 'connect' ? 'bg-purple-600 dark:bg-purple-400' : 'bg-purple-200 dark:bg-purple-800'
          }`} />
        </div>
        <button 
          className="text-sm font-medium text-purple-600 dark:text-purple-400"
          onClick={handleSkip}
        >
          Skip for now
        </button>
      </nav>

      <AnimatePresence mode="wait">
        {step === 'strategy' ? (
          <motion.main
            key="strategy"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 p-6 max-w-xl mx-auto w-full"
          >
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Name your strategy
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Give your trading strategy a memorable name
                </p>
              </div>

              <div className="space-y-6">
                {/* Strategy Name */}
                <div>
                  <input
                    type="text"
                    value={strategyData.name}
                    onChange={(e) => setStrategyData({ ...strategyData, name: e.target.value })}
                    placeholder="e.g. Trend Following Master"
                    className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all
                             dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>

                {/* Strategy Description */}
                <div>
                  <textarea
                    value={strategyData.description}
                    onChange={(e) => setStrategyData({ ...strategyData, description: e.target.value })}
                    placeholder="Brief description of your strategy..."
                    rows={3}
                    className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all
                             dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>

                {/* Strategy Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Popular Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {STRATEGY_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          strategyData.tags.includes(tag)
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
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
                  <span>Continue</span>
                  {isValid && <Check className="w-5 h-5" />}
                </button>

                {!isValid && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-amber-600 dark:text-amber-400"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Please enter a strategy name</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.main>
        ) : (
          <motion.main
            key="connect"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-6 max-w-xl mx-auto w-full"
          >
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Connect your account
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Link your trading platform to verify your results
                </p>
              </div>

              <div className="space-y-6">
                {/* Platform Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setStrategyData({ ...strategyData, platform: 'mt4' })}
                    className={`p-6 rounded-2xl transition-all flex flex-col items-center gap-3 ${
                      strategyData.platform === 'mt4'
                        ? 'bg-purple-50 ring-2 ring-purple-500 dark:bg-purple-900/30 dark:ring-purple-400'
                        : 'bg-white hover:bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ChartLine className={`w-8 h-8 ${
                      strategyData.platform === 'mt4' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      strategyData.platform === 'mt4' ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      MetaTrader 4
                    </span>
                  </button>

                  <button
                    onClick={() => setStrategyData({ ...strategyData, platform: 'mt5' })}
                    className={`p-6 rounded-2xl transition-all flex flex-col items-center gap-3 ${
                      strategyData.platform === 'mt5'
                        ? 'bg-purple-50 ring-2 ring-purple-500 dark:bg-purple-900/30 dark:ring-purple-400'
                        : 'bg-white hover:bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ChartLine className={`w-8 h-8 ${
                      strategyData.platform === 'mt5' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      strategyData.platform === 'mt5' ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      MetaTrader 5
                    </span>
                  </button>
                </div>

                {/* Account Credentials */}
                {strategyData.platform && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={strategyData.credentials.username}
                        onChange={(e) => setStrategyData({
                          ...strategyData,
                          credentials: { ...strategyData.credentials, username: e.target.value }
                        })}
                        className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all
                                 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={strategyData.credentials.password}
                        onChange={(e) => setStrategyData({
                          ...strategyData,
                          credentials: { ...strategyData.credentials, password: e.target.value }
                        })}
                        className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all
                                 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/30"
                    >
                      <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        We only request read-only access to your trading history. Your account credentials are encrypted and never stored.
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                <button 
                  onClick={handleContinue}
                  disabled={!isValid}
                  className={`w-full py-4 rounded-2xl font-medium text-lg transition-all duration-200 flex items-center justify-center gap-2
                    ${isValid 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]' 
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}
                >
                  <span>Connect Account</span>
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
        )}
      </AnimatePresence>
    </div>
  );
} 