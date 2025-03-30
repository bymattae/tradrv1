'use client';

import { motion } from 'framer-motion';
import { Trophy, ChartLine, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Trophy,
    title: 'Compete & Earn',
    description: 'Join trading competitions and earn rewards based on your performance.'
  },
  {
    icon: ChartLine,
    title: 'Track Progress',
    description: 'Monitor your trading performance with detailed analytics and insights.'
  },
  {
    icon: Users,
    title: 'Connect',
    description: 'Follow other successful traders and share strategies with the community.'
  }
];

export default function Success() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl space-y-12 text-center"
        >
          {/* Success Animation */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="w-24 h-24 mx-auto bg-purple-600 rounded-full flex items-center justify-center"
            >
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-1 -right-1"
            >
              <div className="w-6 h-6 bg-yellow-400 rounded-full" />
            </motion.div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to tradr! 🎉
            </h1>
            <p className="text-gray-600">
              Your profile is set up and ready to go. Let's start your trading journey!
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </main>
    </div>
  );
} 