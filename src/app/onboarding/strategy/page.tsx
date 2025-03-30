'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChartLine, Info, Check } from 'lucide-react';
import Link from 'next/link';

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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-4">
        <Link href="/onboarding/profile" className="text-purple-600 hover:text-purple-700">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <button className="text-sm text-purple-600 font-medium">
          Skip for now
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl space-y-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Name your strategy
            </h1>
            <p className="mt-2 text-sm text-gray-600">
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Strategy Description */}
            <div>
              <textarea
                value={strategyData.description}
                onChange={(e) => setStrategyData({ ...strategyData, description: e.target.value })}
                placeholder="Brief description of your strategy..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Strategy Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Popular Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {STRATEGY_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      strategyData.tags.includes(tag)
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Connect your trading account
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setStrategyData({ ...strategyData, platform: 'mt4' })}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    strategyData.platform === 'mt4'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <ChartLine className={`w-6 h-6 ${
                    strategyData.platform === 'mt4' ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    strategyData.platform === 'mt4' ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    MetaTrader 4
                  </span>
                </button>

                <button
                  onClick={() => setStrategyData({ ...strategyData, platform: 'mt5' })}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    strategyData.platform === 'mt5'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <ChartLine className={`w-6 h-6 ${
                    strategyData.platform === 'mt5' ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    strategyData.platform === 'mt5' ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    MetaTrader 5
                  </span>
                </button>
              </div>
            </div>

            {/* Account Credentials */}
            {strategyData.platform && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={strategyData.credentials.username}
                    onChange={(e) => setStrategyData({
                      ...strategyData,
                      credentials: { ...strategyData.credentials, username: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={strategyData.credentials.password}
                    onChange={(e) => setStrategyData({
                      ...strategyData,
                      credentials: { ...strategyData.credentials, password: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-xl">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    We only request read-only access to your trading history. Your account credentials are encrypted and never stored.
                  </p>
                </div>
              </motion.div>
            )}

            <button 
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              onClick={() => {/* Handle strategy setup */}}
            >
              <span>Sync Now</span>
              <Check className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 