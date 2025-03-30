'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Verify() {
  const [code, setCode] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get email from localStorage
    const email = localStorage.getItem('userEmail');
    if (email) setUserEmail(email);

    // Start countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // If all digits are filled, proceed
    if (newCode.every(digit => digit) && newCode.join('').length === 4) {
      handleVerify();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    // For now, just proceed to profile setup
    router.push('/onboarding/profile');
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimeLeft(30);
    setCanResend(false);
    // Resend verification code logic here
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <nav className="flex items-center p-4">
        <Link href="/auth" className="text-purple-600 hover:text-purple-700">
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Verify your email
            </h1>
            <p className="text-gray-600">
              We&apos;ve sent a verification code to {userEmail}
            </p>
          </div>

          <div className="space-y-6">
            {/* Code input */}
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              ))}
            </div>

            <button 
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
              onClick={handleVerify}
            >
              Verify Email
            </button>

            <div className="text-center space-y-2">
              <p className="text-gray-600">
                Didn&apos;t receive the code?
              </p>
              <button
                onClick={handleResend}
                disabled={!canResend}
                className={`text-sm font-medium ${
                  canResend 
                    ? 'text-purple-600 hover:text-purple-700' 
                    : 'text-gray-400'
                }`}
              >
                {canResend ? 'Resend Code' : `Resend in ${timeLeft}s`}
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 