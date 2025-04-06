import { ArrowLeft, LineChart } from 'lucide-react';
import Link from 'next/link';

export default function Strategies() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="flex items-center px-6 py-4 border-b border-[#222222]">
        <Link href="/onboarding/profile" className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </header>

      <div className="p-6 space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-medium">Your strategies</h1>
          <p className="text-[#666666] mt-1">Manage your connected trading accounts.</p>
        </div>

        {/* Empty state */}
        <div className="bg-[#141414] rounded-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-[#1A1A1A] rounded-xl flex items-center justify-center">
              <LineChart className="w-6 h-6 text-[#666666]" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">No strategies yet</h3>
          <p className="text-[#666666] text-sm mb-6">
            Create your first trading strategy to get started
          </p>
          <Link
            href="/onboarding/strategies/new"
            className="inline-flex items-center justify-center bg-[#7C3AED] hover:bg-[#6D31D9] text-white rounded-xl px-6 py-3 font-medium transition-colors"
          >
            + Add New Strategy
          </Link>
        </div>

        {/* Skip option */}
        <div className="text-center">
          <Link
            href="/dashboard"
            className="text-[#666666] hover:text-white transition-colors"
          >
            Skip for now
          </Link>
        </div>
      </div>
    </main>
  );
} 