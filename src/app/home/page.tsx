'use client';

import { motion } from 'framer-motion';
import { ArrowRight, LineChart, Trophy, Share2, Target, BarChart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: <BarChart className="w-6 h-6" />,
    title: 'Auto-sync MT4/MT5',
    description: 'Connect your trading accounts. We handle the rest.'
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: 'Build Public Profile',
    description: 'Your performance, verified by real data.'
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: 'Share Proof on Socials',
    description: 'One-click sharing to any platform.'
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Rank on Leaderboards',
    description: 'Compete with the best traders.'
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Pass Challenges',
    description: 'Unlock funding and rewards.'
  }
];

const traders = [
  { name: '@phantom', stats: '+432%', avatar: '/avatars/1.png' },
  { name: '@killerwhale', stats: '+267%', avatar: '/avatars/2.png' },
  { name: '@traderjoe', stats: '+198%', avatar: '/avatars/3.png' },
  { name: '@cryptoqueen', stats: '+156%', avatar: '/avatars/4.png' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-[SpaceGrotesk] selection:bg-[#00FF7F] selection:text-black">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,127,0.1),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              this isn&apos;t trading.
              <br />
              it&apos;s performance.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12">
              public trading profiles. verified by data.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-black bg-[#00FF7F] rounded-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,127,0.5)] transition-all duration-300"
            >
              get your tradr link
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-gray-900/50 hover:bg-gray-900 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,127,0.1)]"
              >
                <div className="w-12 h-12 bg-[#00FF7F]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00FF7F]/20 transition-colors">
                  <div className="text-[#00FF7F]">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mockup Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,127,0.05),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute inset-0 bg-[#00FF7F]/20 blur-3xl rounded-full transform -translate-x-1/2" />
              <Image
                src="/mockup.png"
                alt="Tradr App"
                width={400}
                height={800}
                className="relative mx-auto transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mt-12">
              this is your new flex.
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              built for funded traders,
              <br />
              creators, and killers.
            </h2>
          </motion.div>
          
          <div className="flex justify-center space-x-8 overflow-hidden">
            {traders.map((trader, index) => (
              <motion.div
                key={trader.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-gray-800 mb-4 overflow-hidden">
                  <Image
                    src={trader.avatar}
                    alt={trader.name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div className="text-lg font-medium">{trader.name}</div>
                <div className="text-[#00FF7F] font-bold">{trader.stats}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,127,0.1),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-12">
              ready to show what you&apos;re
              <br />
              really made of?
            </h2>
            <Link
              href="/auth/signup"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-black bg-[#00FF7F] rounded-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,127,0.5)] transition-all duration-300"
            >
              claim your tradr handle
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 