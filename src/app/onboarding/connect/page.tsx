'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, Check, AlertCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormData {
  platform: 'mt4' | 'mt5';
  username: string;
  password: string;
}

export default function ConnectAccount() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    platform: 'mt4',
    username: '',
    password: ''
  });

  const [isValid, setIsValid] = useState(false);

  const handleSubmit = () => {
    if (formData.username && formData.password) {
      // Store connection data
      localStorage.setItem('connectionData', JSON.stringify(formData));
      router.push('/onboarding/success');
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-lg border-b border-gray-100">
        <Link href="/onboarding/strategy" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1 rounded-full bg-purple-200" />
          <div className="w-16 h-1 rounded-full bg-purple-600" />
        </div>
        <button 
          onClick={handleSkip}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Skip
        </button>
      </nav>

      <main className="flex-1 p-6 max-w-xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Connect your account
            </h1>
            <p className="text-gray-600">
              Link your trading platform to verify your results
            </p>
          </div>

          {/* Platform Selection */}
          <div className="bg-gray-50 p-1.5 rounded-2xl flex">
            <button
              onClick={() => setFormData({ ...formData, platform: 'mt4' })}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200
                ${formData.platform === 'mt4'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'}`}
            >
              MetaTrader 4
            </button>
            <button
              onClick={() => setFormData({ ...formData, platform: 'mt5' })}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200
                ${formData.platform === 'mt5'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'}`}
            >
              MetaTrader 5
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200"
                placeholder="Enter your MT4/MT5 username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200"
                placeholder="Enter your MT4/MT5 password"
              />
            </div>
          </div>

          {/* Info Badge */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              We only request read-only access to your trading history. Your credentials are encrypted and never stored.
            </p>
          </div>

          {/* Connect Button */}
          <div className="space-y-4">
            <button
              onClick={handleSubmit}
              disabled={!formData.username || !formData.password}
              className={`w-full py-4 rounded-2xl font-medium text-lg transition-all duration-200 flex items-center justify-center gap-2
                ${formData.username && formData.password
                  ? 'bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-100 text-gray-400'}`}
            >
              <Lock className="w-5 h-5" />
              <span>Connect Account</span>
            </button>

            {(!formData.username || !formData.password) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-amber-600"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Please fill in all required fields</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
} 